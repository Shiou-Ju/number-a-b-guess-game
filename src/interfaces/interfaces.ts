export interface GameRoom {
  id: string;
  player1: {
    id: string;
    secretNumber?: string;
    ready: boolean;
  };
  player2?: {
    id: string;
    secretNumber?: string;
    ready: boolean;
  };
  status: 'waiting' | 'playing' | 'finished';
  guessHistory: Array<{
    playerId: string;
    guess: string;
    result: string;
    timestamp: number;
  }>;
}


export interface GameRepository {
  createRoom(playerId: string): Promise<GameRoom>;
  joinRoom(roomId: string, playerId: string): Promise<GameRoom>;
  setNumber(roomId: string, playerId: string, number: string): Promise<void>;
  makeGuess(roomId: string, playerId: string, guess: string): Promise<string>;
  getRoom(roomId: string): Promise<GameRoom | null>;
}
