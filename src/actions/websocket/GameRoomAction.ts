import { Action, ActionProcessor } from "actionhero";
import { GameService } from "../../services/GameService";
import { GameFactory } from "../../factories/GameFactory";
import { ActionResponse } from 'actionhero/dist/classes/action';

export class GameRoomAction extends Action {
  private gameService: GameService;

  constructor() {
    super();
    this.name = "gameRoom";
    this.description = "遊戲房間相關操作";
    this.inputs = {
      command: { required: true },
      roomId: { required: false },
      number: { required: false },
      guess: { required: false }
    };
    
    // 在建構函數中初始化 gameService
    this.gameService = new GameService(GameFactory.createRepository());
  }

  // TODO: make enum for command not switch case
  async run(data: ActionProcessor<Action>): Promise<ActionResponse> {
    const { connection, params } = data;
    const { command } = params;

    switch (command) {
      case "create":
        return { room: await this.gameService.createRoom(connection.id) };
      case "join":
        if (!params.roomId) throw new Error("需要房間 ID");
        return { room: await this.gameService.joinRoom(params.roomId, connection.id) };
      case "setNumber":
        if (!params.roomId || !params.number) throw new Error("需要房間 ID 和數字");
        await this.gameService.setNumber(params.roomId, connection.id, params.number);
        return { success: true };
      case "guess":
        if (!params.roomId || !params.guess) throw new Error("需要房間 ID 和猜測數字");
        const result = await this.gameService.makeGuess(params.roomId, connection.id, params.guess);
        return { result };
      default:
        throw new Error("未知的命令");
    }
  }
}
