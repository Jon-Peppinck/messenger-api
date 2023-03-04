import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';

import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key: string) {
    return await this.cache.get(key);
  }

  async set(key: string, value: unknown) {
    await this.cache.set(key, value);
  }

  async del(key: string) {
    await this.cache.del(key);
  }

  async reset() {
    await this.cache.reset();
  }
}
