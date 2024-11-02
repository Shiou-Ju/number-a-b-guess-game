function setPlayerNumber() {
  if (selectedNumbers.length !== 4) {
    alert('請選擇4個不同的數字！');
    return;
  }

  fetch("http://localhost:5577/api/gameRoom", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      apiVersion: 1,
      command: "setNumber",
      roomId: currentRoomId,
      number: selectedNumbers.join('')
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      alert(data.error);
    } else {
      alert('數字設置成功！');
    }
  })
  .catch(error => console.error('Error:', error));
}

// 保留原有的 WebSocket 聊天功能
function handleChatSubmit(e) {
  e.preventDefault();
  const messageInput = document.getElementById('message');
  const message = messageInput.value.trim();
  if (message && currentRoomId) {
    client.say(`game-${currentRoomId}`, message);
    messageInput.value = '';
  }
} 