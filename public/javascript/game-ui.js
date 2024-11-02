// 更新顯示的玩家數字
function updatePlayerNumber() {
  document.getElementById('playerNumber').textContent = 
    selectedNumbers.join('') || '未設定';
}

// 清除選擇的數字
function clearSelectedNumbers() {
  selectedNumbers = [];
  updatePlayerNumber();
}

// 生成隨機數字
function generateRandomNumber() {
  const numbers = [1,2,3,4,5,6,7,8,9];
  selectedNumbers = [];
  for(let i = 0; i < 4; i++) {
    const index = Math.floor(Math.random() * numbers.length);
    selectedNumbers.push(numbers.splice(index, 1)[0]);
  }
  updatePlayerNumber();
}

// 設置玩家數字
function setPlayerNumber() {
  if (selectedNumbers.length !== 4) {
    alert('請選擇4個不同的數字！');
    return;
  }

  client.action("gameRoom", {
    command: "setNumber",
    roomId: currentRoomId,
    number: selectedNumbers.join('')
  }, (response) => {
    if (response.error) {
      alert(response.error);
    } else {
      alert('數字設置成功！');
    }
  });
}

function updateAvailableNumbers() {
  const usedNumbers = new Set(selectedNumbers);
  document.querySelectorAll('.number-btn').forEach(btn => {
    const number = btn.dataset.number;
    btn.disabled = usedNumbers.has(number);
  });
}
