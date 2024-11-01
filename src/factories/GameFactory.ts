import { GameRepository, StorageType } from '../interfaces/interfaces';
import { LocalStorageGameRepository } from '../repositories/LocalStorageGameRepository';
import { RedisGameRepository } from '../repositories/RedisGameRepository';

export class GameFactory {
  static createRepository(storageType: string = StorageType.LOCAL): GameRepository {
    const type = (process.env.STORAGE_TYPE || storageType).toLowerCase();

    if (type === StorageType.REDIS) {
      return new RedisGameRepository();
    }

    return new LocalStorageGameRepository();
  }
}
