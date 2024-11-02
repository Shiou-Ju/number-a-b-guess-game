import { Action, ActionProcessor } from "actionhero";
import { GameService } from "../../services/GameService";
import { GameFactory } from "../../factories/GameFactory";
import { ActionResponse } from 'actionhero/dist/classes/action';
import { GameCommand } from '../../interfaces/interfaces';
import { validateNumber } from '../../utils/validators';

export class GameRoomAction extends Action {
  private gameService: GameService;

  constructor() {
    super();
    this.name = "gameRoom";
    this.description = "遊戲房間相關操作";
    this.version = 1;
    this.outputExample = {
      room: {
        id: "abc123",
        status: "waiting",
        player1: { id: "player1", ready: false }
      }
    };

    this.inputs = {
      command: {
        required: true,
        validator: (param: string) => {
          if (!Object.values(GameCommand).includes(param as GameCommand)) {
            throw new Error("未知的命令");
          }
          return true;
        }
      },
      roomId: { required: false },
      number: { 
        required: false,
        validator: (param: string) => {
          if (param && !validateNumber(param)) {
            throw new Error("無效的數字：必須是4個不重複的數字（1-9）");
          }
          return true;
        }
      },
      guess: { 
        required: false,
        validator: (param: string) => {
          if (param && !validateNumber(param)) {
            throw new Error("猜測必須是4個不重複的1-9數字");
          }
          return true;
        }
      }
    };

    this.gameService = new GameService(GameFactory.createRepository());
  }

  async run(data: ActionProcessor<Action>): Promise<ActionResponse> {
    const { connection, params } = data;
    const { command } = params;

    if (command === GameCommand.CREATE) {
      return { room: await this.gameService.createRoom(connection.id) };
    }

    if (command === GameCommand.JOIN) {
      if (!params.roomId) throw new Error("需要房間 ID");
      return { room: await this.gameService.joinRoom(params.roomId, connection.id) };
    }

    if (command === GameCommand.SET_NUMBER) {
      if (!params.roomId || !params.number) throw new Error("需要房間 ID 和數字");
      await this.gameService.setNumber(params.roomId, connection.id, params.number);
      return { success: true };
    }

    if (command === GameCommand.GUESS) {
      if (!params.roomId || !params.guess) throw new Error("需要房間 ID 和猜測數字");
      const result = await this.gameService.makeGuess(params.roomId, connection.id, params.guess);
      return { result };
    }

    if (command === GameCommand.LIST) {
      return { rooms: await this.gameService.listRooms() };
    }

    throw new Error("未知的命令");
  }
}
