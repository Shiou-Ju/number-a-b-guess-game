import { WebSocket } from 'ws';

// 從命令行參數獲取角色和房間ID
const role = process.argv[2];
const targetRoomId = process.argv[3];

if (!role || (role === 'player2' && !targetRoomId)) {
  console.error('使用方式:');
  console.error('玩家1: yarn ts-node src/test-client.ts player1');
  console.error('玩家2: yarn ts-node src/test-client.ts player2 <房間ID>');
  process.exit(1);
}

const ws = new WebSocket('ws://127.0.0.1:5577/websocket', {
  handshakeTimeout: 5000,
  perMessageDeflate: false,
  family: 4
});

let roomId: string | null = null;

ws.on('connecting', () => {
  console.log('正在嘗試連接...');
});

ws.on('open', () => {
  console.log(`${role === 'player1' ? '玩家1' : '玩家2'}已連接到遊戲伺服器`);
  
  if (role === 'player1') {
    // 創建房間
    ws.send(JSON.stringify({
      event: "action",
      room: "defaultRoom",
      params: {
        action: "gameRoom",
        command: "create"
      }
    }));
  } else {
    // 加入房間
    console.log('嘗試加入房間:', targetRoomId);
    ws.send(JSON.stringify({
      event: "action",
      room: "defaultRoom",
      params: {
        action: "gameRoom",
        command: "join",
        roomId: targetRoomId
      }
    }));
  }
});

ws.on('message', (data) => {
  const message = JSON.parse(data.toString());
  console.log('收到訊息:', message);
  
  if (role === 'player1' && message.room?.id && !roomId) {
    roomId = message.room.id;
    console.log('房間已創建，ID:', roomId);
    setPlayerNumber('1234');
  } else if (role === 'player2' && message.room?.player2?.id) {
    setPlayerNumber('5678');
  }

  if (message.room?.status === 'playing') {
    setTimeout(() => {
      console.log('開始猜測對手數字...');
      makeGuess(role === 'player1' ? '5678' : '1234');
    }, 2000);
  }
});

function setPlayerNumber(number: string) {
  setTimeout(() => {
    ws.send(JSON.stringify({
      event: "action",
      room: "defaultRoom",
      params: {
        action: "gameRoom",
        command: "setNumber",
        roomId: role === 'player1' ? roomId : targetRoomId,
        number: number
      }
    }));
  }, 1000);
}

function makeGuess(guess: string) {
  ws.send(JSON.stringify({
    event: "action",
    room: "defaultRoom",
    params: {
      action: "gameRoom",
      command: "guess",
      roomId: role === 'player1' ? roomId : targetRoomId,
      guess: guess
    }
  }));
}

ws.on('error', (error: any) => {
  console.error('WebSocket 錯誤:', error.code || error);
  if (error.code === 'ECONNREFUSED') {
    console.log('伺服器連線被拒絕，請確認：');
    console.log('1. 伺服器是否已啟動');
    console.log('2. 端口 5577 是否正確');
    console.log('3. 防火牆設定是否正確');
  }
});

ws.on('close', () => {
  console.log('連線已關閉');
});

process.on('SIGINT', () => {
  ws.close();
  process.exit(0);
});
