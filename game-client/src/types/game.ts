export interface GameRoom {
  id: string;
  player1: Player;
  player2?: Player;
  status: GameStatus;
  guessHistory: GuessHistory[];
}

export interface Player {
  id: string;
  secretNumber?: string;
  ready: boolean;
}

export interface GuessHistory {
  playerId: string;
  guess: string;
  result: string;
  timestamp: number;
}

export type GameStatus = 'waiting' | 'playing' | 'finished';

export interface RoomListRoom {
  id: string;
  status: GameStatus;
  playerCount: number;
}

export enum GameCommand {
  CREATE = "create",
  JOIN = "join",
  SET_NUMBER = "setNumber",
  GUESS = "guess",
  LIST = "list"
}

export interface GameState {
  currentRoomId: string | null;
  currentRoom: GameRoom | null;
  selectedNumbers: string[];
  error: string | null;
}

export type GameAction = 
  | { type: 'SET_ROOM'; payload: GameRoom }
  | { type: 'SELECT_NUMBER'; payload: string }
  | { type: 'CLEAR_NUMBERS' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_ROOM_ID'; payload: string | null };
