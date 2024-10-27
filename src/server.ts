import { Process } from "actionhero";

const actionhero = new Process();

async function main() {
  try {
    console.log("開始啟動 Actionhero...");
    await actionhero.start();
    console.log("Actionhero 啟動完成");
    
    if (actionhero.initializers) {
      console.log("已載入的 initializers:", Object.keys(actionhero.initializers));
    }
    
    // FIX: not showing this in console
    // 使用類型斷言來避免 TypeScript 錯誤
    const api = (actionhero as any).api;
    if (api && api.actions) {
      console.log(" using any 已註冊的動作:", Object.keys(api.actions));
    }
    console.log("伺服器啟動成功於 http://localhost:8080");
  } catch (error) {
    console.error("伺服器啟動錯誤:", error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (error) => {
  console.error('未處理的 Promise 拒絕:', error);
});

main();  // 記得呼叫 main 函數
