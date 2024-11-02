let selectedNumbers = [];
let currentRoomId = null;

// 初始化
function boot() {
  setupUIListeners();
  updateRoomList();
}
//TODO: 連接websocket


// UI 事件監聽設置
function setupUIListeners() {
  // 綁定建立房間按鈕
  document.getElementById('createRoom').onclick = createRoom;

  // 數字按鈕綁定
  document.querySelectorAll('.number-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const number = btn.dataset.number;
      if (selectedNumbers.length < 4 && !selectedNumbers.includes(number)) {
        selectedNumbers.push(number);
        updatePlayerNumber();
        updateAvailableNumbers();
      }
    });
  });

  document.getElementById('clearNumber').onclick = () => {
    clearSelectedNumbers();
    updateAvailableNumbers();
  };
  
  document.getElementById('randomNumber').onclick = () => {
    generateRandomNumber();
    updateAvailableNumbers();
  };
  
  document.getElementById('setNumber').onclick = setPlayerNumber;
  document.getElementById('makeGuess').onclick = makeGuess;
  document.getElementById('messageForm').onsubmit = handleChatSubmit;

  // 定期更新房間列表
  setInterval(updateRoomList, 5000);
}

function createRoom() {
  fetch("http://localhost:5577/api/gameRoom", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      apiVersion: 1,
      command: "create"
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.room) {
      currentRoomId = data.room.id;
      showGameArea(data.room.id);
    } else if (data.error) {
      console.error(data.error);
    }
  })
  .catch(error => console.error('Error:', error));
}

function joinRoom(roomId) {
  fetch(`http://localhost:5577/api/gameRoom`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      apiVersion: 1,
      command: "join",
      roomId: roomId
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.room) {
      currentRoomId = data.room.id;
      showGameArea(data.room.id);
    }
  })
  .catch(error => console.error('Error:', error));
}

function updateRoomList() {
  fetch("http://localhost:5577/api/gameRoom", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      apiVersion: 1,
      command: "list"
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.rooms) {
      const roomList = document.getElementById('roomList');
      roomList.innerHTML = data.rooms.map(room => `
        <tr>
          <td>${room.id}</td>
          <td>${room.status}</td>
          <td>${room.playerCount}/2</td>
          <td>
            <button onclick="joinRoom('${room.id}')" 
                    class="btn btn-sm btn-success"
                    ${room.playerCount >= 2 ? 'disabled' : ''}>
              加入
            </button>
          </td>
        </tr>
      `).join('');
    }
  })
  .catch(error => console.error('Error:', error));
}

function showGameArea(roomId) {
  document.getElementById('gameLobby').style.display = 'none';
  document.getElementById('gameArea').style.display = 'block';
  document.getElementById('roomId').textContent = roomId;
}
