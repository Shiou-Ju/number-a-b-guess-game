export const DEFAULT = {
  general: () => {
    return {
      paths: {
        action: [process.cwd() + "/src/actions"],
        // TODO: 加了這行以後發現爆掉了，確實就是這個問題
        initializer: [process.cwd() + "/src/initializers"],
      },
      developmentMode: true,
      startingChatRooms: {},
      actionhero: {
        simultaneousActions: 5
      }
    };
  }
};
