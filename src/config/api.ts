const namespace = "api";

export const DEFAULT = {
  [namespace]: () => {
    return {
      serverToken: "change-me",
      apiVersion: "1",
      serverName: "number-guess-game",
      welcomeMessage: "Welcome to the Number Guess Game",
      // Redis will be needed for production deployments
      redis: {
        enabled: false
      },
      developmentMode: true,
      logLevel: "debug",
      // 添加以下行
      initializerDefaults: {
        loadPriority: 1000,
        startPriority: 1000,
      },
    };
  }
};
