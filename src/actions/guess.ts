import { Action, ActionProcessor } from "actionhero";
import { GameService } from "../services/GameService";
import { GameFactory } from "../factories/GameFactory";

export class GuessAction extends Action {
  private gameService: GameService;

  constructor() {
    super();
    this.name = "guess";
    this.description = "猜測數字";
    this.inputs = {
      roomId: { required: true },
      guess: {
        required: true,
        validator: (param: string) => {
          if (!/^[1-9]{4}$/.test(param) || new Set(param).size !== 4) {
            throw new Error("猜測必須是4個不重複的1-9數字");
          }
          return true;
        },
      },
    };
    
    this.gameService = new GameService(GameFactory.createRepository());
  }

  async run({ connection, params }: ActionProcessor<this>) {
    const { roomId, guess } = params;
    const result = await this.gameService.makeGuess(roomId, connection.id, guess);
    
    return {
      result,
      message: result === "4A0B" ? "恭喜你猜對了!" : "繼續加油!",
    };
  }
}
