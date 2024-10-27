import { Action, ActionProcessor } from "actionhero";
import { GameState } from "../classes/GameState";

export class CreateGameAction extends Action {
  constructor() {
    super();
    this.name = "createGame";
    this.description = "建立新的猜數字遊戲";
    this.inputs = {}; // 即使不需要輸入，也要定義一個空對象
    this.outputExample = {
      gameId: "abc123",
      message: "遊戲建立成功",
      secretNumber: "1234", // 開發環境才會顯示
    };
  }

  async run({ response }: ActionProcessor<this>) {
    const gameId = Math.random().toString(36).substring(7);
    const game = new GameState();

    response.data = {
      gameId,
      message: "遊戲建立成功",
      secretNumber: process.env.NODE_ENV === "development" ? game.getSecretNumber() : undefined,
    };

    return response;
  }
}
