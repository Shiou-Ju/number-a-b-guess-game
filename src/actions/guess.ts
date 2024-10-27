import { Action, ActionProcessor } from "actionhero";
import { GameState } from "../classes/GameState";

export class GuessAction extends Action {
  constructor() {
    super();
    this.name = "guess";
    this.description = "猜測數字";
    this.inputs = {
      gameId: { required: true },
      guess: {
        required: true,
        validator: (param: string) => {
          if (!/^\d{4}$/.test(param)) {
            throw new Error("猜測必須是4位數字");
          }
          return true;
        },
      },
    };
    this.outputExample = {
      result: "1A2B",
      message: "繼續加油!",
    };
  }

  async run({ params, response }: ActionProcessor<this>) {
    const { gameId, guess } = params;

    // TODO: 在實際應用中應該從 Redis 或資料庫中取得遊戲狀態
    const game = new GameState();
    const result = game.checkGuess(guess);

    response.data = {
      result,
      message: result === "4A0B" ? "恭喜你猜對了!" : "繼續加油!",
    };

    return response;
  }
}
