export const DEFAULT = {
  routes: () => {
    return {
      // TODO: let's see if this will make warning disappear
      // warning: an existing action with the same name `createGame` will be overridden by the file /Users/bamboo/Repos/number-a-b-guess-game/src/actions/create.ts
      // 
      get: [
        { path: "/sum", action: "sum" }
      ],
      post: [
        { path: "/game/create", action: "createGame" }
      ],
    };
  }
};
