// 添加聊天訊息到畫面
function appendChatMessage(message) {
  const chatBox = document.getElementById('chatBox');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'chat-message';
  messageDiv.innerHTML = `
    <strong style="color:#${intToARGB(hashCode(message.from))}">${message.from}</strong>
    <small class="text-muted">${formatTime(message.sentAt)}</small>
    <div>${message.message}</div>
  `;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 添加遊戲記錄到畫面
function appendGameLog(message) {
  const gameLog = document.getElementById('gameLog');
  const logDiv = document.createElement('div');
  logDiv.className = 'list-group-item';
  logDiv.textContent = message.message || message.welcome;
  gameLog.insertBefore(logDiv, gameLog.firstChild);
}

// 工具函數
function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString();
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToARGB(i) {
  const color = ((i >> 24) & 0xff).toString(16) +
    ((i >> 16) & 0xff).toString(16) +
    ((i >> 8) & 0xff).toString(16) +
    (i & 0xff).toString(16);
  return color.substring(0, 6);
}
