import { Initializer, api } from 'actionhero';
import { GameRoomAction } from '../actions/websocket/GameRoomAction';

export class ActionsInitializer extends Initializer {
  constructor() {
    super();
    this.name = 'actions';
    this.loadPriority = 1000;
  }

  async initialize() {
    const gameRoomAction = new GameRoomAction();
    api.actions.versions.gameRoom = [1];
    api.actions.actions.gameRoom = {
      '1': gameRoomAction
    };
  }

  async start() {}
  async stop() {}
}
