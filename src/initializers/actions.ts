import { Initializer, api, log, Action } from "actionhero";
import * as path from "path";
import * as fs from "fs";

// 擴展 actionhero 的型別定義
declare module "actionhero" {
  interface ActionsApi {
    versions: {
      [key: string]: Action[];
    };
  }
}

export class ActionsInitializer extends Initializer {
  constructor() {
    super();
    this.name = "actions-initializer";
    this.loadPriority = 1000;
    this.startPriority = 1000;
  }

  private initialized: boolean = false;

  async initialize() {
    if (this.initialized) return;
    this.initialized = true;

    try {
      const actionsPath = path.join(process.cwd(), "src", "actions");
      await this.loadActionsFromDirectory(actionsPath);
      
      log("初始化完成", "info");
      if (api.actions && api.actions.versions) {
        log(`已註冊的動作: ${Object.keys(api.actions.versions).join(", ")}`, "info");
      }
      if (api.routes) {
        log(`已註冊的路由: ${JSON.stringify(api.routes, null, 2)}`, "debug");
      }
      
      // if (api.initializers) {
      //   log(`已載入的 initializer: ${Object.keys(api.initializers).join(", ")}`, "info");
      // } else {
      //   log("警告: api.initializers 未定義", "warning");
      // }
    } catch (error) {
      log(`初始化錯誤: ${error}`, "error");
      throw error;
    }
  }

  private async loadActionsFromDirectory(directory: string) {
    try {
      const files = await fs.promises.readdir(directory);
      
      for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = await fs.promises.stat(fullPath);
        
        
        // console log i am here in actions initializer loading actions
        console.log(`i am here in actions initializer loading actions`);
        
        if (stat.isDirectory()) {
          await this.loadActionsFromDirectory(fullPath);
        } else if (file.endsWith('.ts')) {
          const { default: ActionClass } = await import(fullPath);
          if (ActionClass) {
            const action = new ActionClass();
            if (!api.actions.versions[action.name]) {
              api.actions.versions[action.name] = [];
            }
            
            // TODO: not good using any
            const existingVersionIndex = api.actions.versions[action.name].findIndex((a: any) => a.version === action.version);
            
            // log out existingVersionIndex
            // console.log(`existingVersionIndex: ${existingVersionIndex}`);
            
            if (existingVersionIndex >= 0) {
              api.actions.versions[action.name][existingVersionIndex] = action;
              // TODO: use console.log temporary
              console.log(`更新動作: ${action.name} (版本 ${action.version})`);
            } else {
              api.actions.versions[action.name].push(action);
              // TODO: use console.log temporary
              console.log(`新增動作: ${action.name} (版本 ${action.version})`);
            }
          }
        }
      }
    } catch (error) {
      log(`載入動作時發生錯誤: ${error}`, 'error');
      throw error;
    }
  }
}

export default ActionsInitializer;
