#!/usr/bin/env node

// load any custom code, configure the env, as needed

async function main() {
  // create a new actionhero process
  const { Process } = await import("actionhero");
  const app = new Process();

  console.log("正在啟動 Actionhero 進程...");

  // handle unix signals and uncaught exceptions & rejections
  app.registerProcessSignals((exitCode) => {
    console.log(`進程即將退出，退出碼：${exitCode}`);
    process.exit(exitCode);
  });

  try {
    // start the app!
    // you can pass custom configuration to the process as needed
    await app.start();
    console.log("Actionhero 進程已成功啟動");
  } catch (error) {
    console.error("啟動 Actionhero 進程時發生錯誤:", error);
  }
}

main();
