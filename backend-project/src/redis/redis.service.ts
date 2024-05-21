import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string | number, expireTime?: number) {
    await this.redisClient.set(key, value);

    if (expireTime) {
      await this.redisClient.expire(key, expireTime);
    }
  }
}
