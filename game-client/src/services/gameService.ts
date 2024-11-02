import { GameRoom, RoomListRoom } from '../types/game';

class GameService {
  private API_URL = 'http://localhost:5577/api/gameRoom';
  private ws: WebSocket | null = null;
  private messageHandlers: ((data: any) => void)[] = [];

  connectWebSocket(roomId: string) {
    this.ws = new WebSocket('ws://127.0.0.1:5577/websocket');
    
    this.ws.onopen = () => {
      if (this.ws) {
        this.ws.send(JSON.stringify({
          event: "action",
          room: "defaultRoom",
          params: {
            action: "gameRoom",
            command: "join",
            roomId
          }
        }));
      }
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.room) {
        this.messageHandlers.forEach(handler => handler(data));
      }
    };

    return {
      subscribe: (handler: (data: any) => void) => {
        this.messageHandlers.push(handler);
        return () => {
          this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
        };
      },
      close: () => this.ws?.close()
    };
  }

  async createRoom(): Promise<GameRoom> {
    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiVersion: 1,
        command: 'create'
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.room;
  }

  async setNumber(roomId: string, number: string): Promise<void> {
    this.ws?.send(JSON.stringify({
      event: "action",
      room: "defaultRoom",
      params: {
        action: "gameRoom",
        command: "setNumber",
        roomId,
        number
      }
    }));
  }

  async listRooms(): Promise<RoomListRoom[]> {
    const response = await fetch(`${this.API_URL}?command=list`);
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.rooms;
  }

  async setReady(roomId: string): Promise<void> {
    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiVersion: 1,
        command: 'ready',
        roomId
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
  }

  async makeGuess(roomId: string, guess: string): Promise<void> {
    this.ws?.send(JSON.stringify({
      event: "action",
      room: "defaultRoom",
      params: {
        action: "gameRoom",
        command: "guess",
        roomId,
        guess
      }
    }));
  }
}

export const gameService = new GameService();
