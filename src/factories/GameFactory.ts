import { RedisGameRepository } from '../repositories/RedisGameRepository';
import { LocalStorageGameRepository } from '../repositories/LocalStorageGameRepository';
import { GameRepository } from '../interfaces/interfaces';

export class GameFactory {
  static createRepository(): GameRepository {
    // 根據環境變數決定使用哪種儲存方式
    const storageType = process.env.STORAGE_TYPE || 'redis';
    
    // TODO: make enum for storageType not switch case
    switch (storageType.toLowerCase()) {
      case 'local':
        return new LocalStorageGameRepository();
      case 'redis':
      default:
        return new RedisGameRepository();
    }
  }
}
