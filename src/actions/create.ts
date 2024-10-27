import { Action, ActionProcessor } from "actionhero";
import { GameState } from "../classes/GameState";

export class CreateGameAction extends Action {
  constructor() {
    super();
    this.name = "createGame";
    this.description = "建立新遊戲";
    this.version = 1;
    this.middleware = [];
    this.logLevel = "debug";
    this.toDocument = true;
    this.inputs = {
      required: {},
      optional: {}
    };
  }

  async run(data: ActionProcessor<this>) {
    try {
      console.log("開始建立遊戲...");
      const gameId = Math.random().toString(36).substring(7);
      const game = new GameState();
      
      const result = {
        gameId: gameId,
        message: "遊戲建立成功",
        secretNumber: game.getSecretNumber()
      };

      console.log("遊戲建立結果:", result);
      return result;
    } catch (error) {
      console.error("遊戲建立錯誤:", error);
      throw error;
    }
  }
}

export default CreateGameAction;
