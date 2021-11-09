import { Injectable } from "@nestjs/common";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import { Redis } from "ioredis";

@Injectable()
export class RedisService {
  constructor(@InjectRedis("default") private readonly redisClient: Redis) {}

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async set(key: string, value: string, expiryTime: number) {
    return this.redisClient.set(key, value, "ex", expiryTime);
  }

  async del(key: string): Promise<number> {
    return this.redisClient.del(key);
  }
}
