import { chatRoom } from "actionhero";
import { GameRepository, GameRoom, RoomListRoom } from '../interfaces/interfaces';
import { validateNumber } from '../utils/validators';


export class GameService {
  constructor(private repository: GameRepository) {}

  async createRoom(playerId: string): Promise<GameRoom> {
    const room = await this.repository.createRoom(playerId);

    await chatRoom.add(`game-${room.id}`);
    return room;
  }

  async setNumber(roomId: string, playerId: string, number: string): Promise<void> {
    if (!validateNumber(number)) {
      throw new Error("無效的數字：必須是4個不重複的數字（1-9）");
    }

    await this.repository.setNumber(roomId, playerId, number);
    
    const room = await this.repository.getRoom(roomId);

    if (room.player1?.ready && room.player2?.ready) {
      await chatRoom.broadcast({}, `game-${roomId}`, "遊戲開始！");
    }
  }

  async makeGuess(roomId: string, playerId: string, guess: string): Promise<string> {
    const result = await this.repository.makeGuess(roomId, playerId, guess);

    await chatRoom.broadcast(
      {},
      `game-${roomId}`,
      `玩家 ${playerId} 猜測：${guess}，結果：${result}`
    );

    return result;
  }

  async joinRoom(roomId: string, playerId: string): Promise<GameRoom> {
    const room = await this.repository.joinRoom(roomId, playerId);

    await chatRoom.broadcast({}, `game-${roomId}`, `玩家 ${playerId} 加入了房間`);
    return room;
  }

  async listRooms(): Promise<RoomListRoom[]> {
    const rooms = await this.repository.listRooms();
    return rooms.map(room => ({
      id: room.id,
      status: room.status,
      playerCount: (room.player2 ? 2 : 1)
    }));
  }
}
