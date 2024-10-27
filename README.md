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




