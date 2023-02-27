import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';

import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key: string) {
    console.log(`GET ${key} from REDIS`);
    return await this.cache.get(key);
  }

  async set(key: string, value: unknown) {
    console.log(`SET ${key} from REDIS`);
    await this.cache.set(key, value);
  }

  async del(key: string) {
    await this.cache.del(key);
  }
}
