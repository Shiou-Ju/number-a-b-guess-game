import { ActionheroConfigInterface } from "actionhero";

export const DEFAULT: ActionheroConfigInterface["servers"] = {
  servers: {
    web: () => {
      return {
        enabled: true,
        secure: false,
        port: process.env.PORT || 8080,
        bindIP: "0.0.0.0",
        httpHeaders: {
          "X-Powered-By": "actionhero",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Content-Type": "application/json; charset=utf-8"
        },
        matchExtensionMime: true,
        urlPathForActions: "api",  // 改回 "api"
        rootEndpointType: "api",
        metadataOptions: {
          serverInformation: true,
          requesterInformation: true
        },
        defaultMiddleware: [
          "web-server",
          (data: { connection: { rawConnection: { method: string; uri: string } } }, next: () => void) => {
            console.log(`收到請求: ${data.connection.rawConnection.method} ${data.connection.rawConnection.uri}`);
            next();
          }
        ],
        loadRoutes: true,
        returnErrorCodes: true
      }
    },
    websocket: () => {
      return {
        enabled: true,
        clientUrl: 'window.location.origin'
      }
    }
  }
};
