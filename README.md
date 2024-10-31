# number-a-b-guess-game
Given a number and the opponent should reply with `how many As and how many Bs`


## package.json
supposed to use:
```
  "dependencies": {
    "@types/jest": "^29.5.14",
    "@types/node": "^22.8.1",
    "actionhero": "^29.3.2",
    "jest": "^29.7.0",
    "ts-jest": "^29.2.5",
    "ts-node": "^10.9.2",
    "typescript": "^5.6.3"
  },
  "devDependencies": {
    "ts-node-dev": "^2.0.0"
  }

```

### 嘗試換了以下
```
  "dependencies": {
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.0",
    "actionhero": "^28.0.0",
    "jest": "^27.5.1",
    "ts-jest": "^27.1.5",
    "ts-node": "^10.9.1",
    "typescript": "^4.9.5"
  },
```
但是沒有


## 解決資料流沒有進去的問題
1. action 是有版本號的
   1. "actions of the same name with various versions, set the version parameter"
   2. 試試看把名字換到有
2. 用 cli 也許可以解
   1. Use the actionhero CLI
      1. (npx) actionhero generate action --name my_action
      2. (npx) actionhero generate task --name my_task --queue default --frequency 0





# all apis

1. **創建遊戲 (createGame)**

```bash
curl -6 -X POST http://localhost:5577/api/createGame
```

2. **獲取狀態 (status)**

```bash
curl -6 -X GET http://localhost:5577/api/status
```

3. **計算和 (sum)**

```bash
curl -6 -X POST http://localhost:5577/api/sum -H "Content-Type: application/json" -d '{"a": 1, "b": 2}'
```

4. **猜測數字 (guess)**

```bash
curl -6 -X POST http://localhost:5577/api/guess -H "Content-Type: application/json" -d '{"gameId": "your_game_id", "guess": "1234"}'
```



# 遊戲模式
1. 玩家可以開啟 socket 聊天室，並且兩位玩家可以互相對戰
2. 玩家需要自行設定自己的數字，必須為四位數，1-9 不能重複
   1. 需要實作數字鍵盤，讓玩家可以快速輸入數字
   2. 需要實作隨機生成數字，讓玩家可以快速生成數字
3. 玩家可以猜測對手的數字，猜測數字後，會回傳猜測的結果，例如 `1A2B`，表示有1個數字猜對，且有2個數字位置猜錯
4. 猜測次數不限制，但是每猜一次，遊戲的紀錄會存到 redis 中，redis 會在1小時後過期
   1. TODO: 有辦法可以透過 localstorage 直接實作在記憶體裡面嗎？

## 未來實作項目
1. 保存個人遊戲數據，包含勝率、猜測次數、猜測紀錄
2. 猜測的結果不會因為遊戲紀錄過期而消失
3. 玩家可以選擇是否要開啟自動猜測功能，自動猜測功能會根據對手可能的數字進行猜測，增加猜測的準確性

## 前端介面 TODO
1. 遊戲大廳
   - [ ] 建立遊戲房間按鈕
   - [ ] 顯示現有房間列表
   - [ ] 房間狀態顯示（等待中/遊戲中）

2. 遊戲房間
   - [ ] 數字鍵盤元件（1-9）
     - [ ] 點擊數字時的視覺反饋
     - [ ] 已選擇數字的顯示
     - [ ] 清除按鈕
   - [ ] 隨機生成按鈕
   - [ ] 玩家準備狀態顯示
   - [ ] 對戰雙方資訊顯示

3. 遊戲進行中
   - [ ] 猜測歷史記錄顯示
   - [ ] 剩餘可用數字提示
   - [ ] 遊戲計時器
   - [ ] 回合提示

4. 聊天功能
   - [ ] 聊天訊息列表
   - [ ] 訊息輸入框
   - [ ] 系統訊息顯示（玩家加入/離開等）

5. 使用者介面優化
   - [ ] 響應式設計（支援手機/平板）
   - [ ] 深色/淺色主題切換
   - [ ] 遊戲音效
   - [ ] 操作提示
