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
    try {
      const room = await this.repository.getRoom(roomId);
      if (!room) {
        throw new Error("房間不存在");
      }

      // 檢查是否為房間內的玩家
      if (room.player1.id !== playerId && room.player2?.id !== playerId) {
        throw new Error("非遊戲玩家");
      }

      const result = await this.repository.makeGuess(roomId, playerId, guess);

      // 廣播猜測結果
      await this.broadcast(roomId, `玩家 ${playerId} 猜測：${guess}，結果：${result}`);

      // 如果猜中了
      if (result === '4A0B') {
        const winner = room.player1.id === playerId ? room.player1 : room.player2;
        await this.broadcast(roomId, `遊戲結束！玩家 ${playerId} 獲勝！`);
      }

      return result;
    } catch (error) {
      // 記錄錯誤
      console.error(`遊戲錯誤 [${roomId}]: ${error.message}`);
      throw error;
    }
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

  async broadcast(roomId: string, message: string) {
    await chatRoom.broadcast({}, `game-${roomId}`, message);
  }

  // TODO: not sure if this is needed
  // 新增：檢查玩家是否在房間中
  private async validatePlayer(roomId: string, playerId: string): Promise<void> {
    const room = await this.repository.getRoom(roomId);
    if (!room) {
      throw new Error("房間不存在");
    }
    if (room.player1.id !== playerId && room.player2?.id !== playerId) {
      throw new Error("非遊戲玩家");
    }
  }
}
