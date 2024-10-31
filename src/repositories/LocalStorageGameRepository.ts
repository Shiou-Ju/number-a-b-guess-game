import { GameRepository, GameRoom } from '../interfaces/interfaces';

export class LocalStorageGameRepository implements GameRepository {
  private rooms: Map<string, GameRoom> = new Map();

  async createRoom(playerId: string): Promise<GameRoom> {
    const roomId = Math.random().toString(36).substring(7);
    const room: GameRoom = {
      id: roomId,
      player1: {
        id: playerId,
        ready: false
      },
      status: 'waiting',
      guessHistory: []
    };

    this.rooms.set(roomId, room);
    this.persistToLocalStorage();
    return room;
  }

  async joinRoom(roomId: string, playerId: string): Promise<GameRoom> {
    const room = await this.getRoom(roomId);
    if (!room) throw new Error("房間不存在");
    if (room.player2) throw new Error("房間已滿");

    room.player2 = {
      id: playerId,
      ready: false
    };

    this.rooms.set(roomId, room);
    this.persistToLocalStorage();
    return room;
  }

  async setNumber(roomId: string, playerId: string, number: string): Promise<void> {
    const room = await this.getRoom(roomId);
    if (!room) throw new Error("房間不存在");

    if (room.player1.id === playerId) {
      room.player1.secretNumber = number;
      room.player1.ready = true;
    } else if (room.player2?.id === playerId) {
      room.player2.secretNumber = number;
      room.player2.ready = true;
    }

    if (room.player1.ready && room.player2?.ready) {
      room.status = 'playing';
    }

    this.rooms.set(roomId, room);
    this.persistToLocalStorage();
  }

  async makeGuess(roomId: string, playerId: string, guess: string): Promise<string> {
    const room = await this.getRoom(roomId);
    if (!room) throw new Error("房間不存在");
    if (room.status !== 'playing') throw new Error("遊戲尚未開始");

    const opponent = room.player1.id === playerId ? room.player2 : room.player1;
    if (!opponent?.secretNumber) throw new Error("對手尚未準備好");

    let result = this.checkGuess(guess, opponent.secretNumber);
    
    room.guessHistory.push({
      playerId,
      guess,
      result,
      timestamp: Date.now()
    });

    this.rooms.set(roomId, room);
    this.persistToLocalStorage();
    return result;
  }

  async getRoom(roomId: string): Promise<GameRoom | null> {
    return this.rooms.get(roomId) || null;
  }

  private persistToLocalStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('gameRooms', JSON.stringify(Array.from(this.rooms.entries())));
    }
  }

  // TODO: usage of this method?
  private loadFromLocalStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('gameRooms');
      if (saved) {
        this.rooms = new Map(JSON.parse(saved));
      }
    }
  }

  private checkGuess(guess: string, secret: string): string {
    let a = 0, b = 0;
    for (let i = 0; i < 4; i++) {
      if (guess[i] === secret[i]) {
        a++;
      } else if (secret.includes(guess[i])) {
        b++;
      }
    }
    return `${a}A${b}B`;
  }
}
