import { GameRoom, RoomListRoom } from '../types/game';

class GameService {
  private API_URL = 'http://localhost:5577/api/gameRoom';
  private ws: WebSocket | null = null;
  private messageHandlers: ((data: any) => void)[] = [];

  private ensureWebSocketConnection() {
    if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
      this.ws = new WebSocket('ws://127.0.0.1:5577/websocket');
      
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.room) {
          this.messageHandlers.forEach(handler => handler(data));
        }
      };
    }
    
    return new Promise<void>((resolve, reject) => {
      if (this.ws!.readyState === WebSocket.OPEN) {
        resolve();
      } else {
        this.ws!.onopen = () => resolve();
        this.ws!.onerror = () => reject(new Error('WebSocket 連接失敗'));
      }
    });
  }

  async createRoom(): Promise<GameRoom> {
    await this.ensureWebSocketConnection();
    
    this.ws!.send(JSON.stringify({
      event: "action",
      room: "defaultRoom",
      params: {
        action: "gameRoom",
        command: "create"
      }
    }));

    return new Promise((resolve, reject) => {
      const handler = (data: any) => {
        if (data.room) {
          this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
          resolve(data.room);
        }
      };
      this.messageHandlers.push(handler);
      
      // 設置超時
      setTimeout(() => {
        this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
        reject(new Error('創建房間超時'));
      }, 5000);
    });
  }

  async joinRoom(roomId: string): Promise<void> {
    await this.ensureWebSocketConnection();
    
    this.ws!.send(JSON.stringify({
      event: "action",
      room: "defaultRoom",
      params: {
        action: "gameRoom",
        command: "join",
        roomId
      }
    }));

    return new Promise((resolve, reject) => {
      const handler = (data: any) => {
        if (data.room) {
          this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
          resolve();
        }
        if (data.error) {
          this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
          reject(new Error(data.error));
        }
      };
      this.messageHandlers.push(handler);
      
      setTimeout(() => {
        this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
        reject(new Error('加入房間超時'));
      }, 5000);
    });
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

  connectWebSocket(roomId: string) {
    this.ensureWebSocketConnection();
    
    return {
      subscribe: (handler: (data: any) => void) => {
        this.messageHandlers.push(handler);
        return () => {
          this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
        };
      },
      close: () => {
        if (this.ws) {
          this.ws.close();
          this.ws = null;
        }
      }
    };
  }
}

export const gameService = new GameService();
