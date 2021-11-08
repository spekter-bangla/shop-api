import { Injectable } from "@nestjs/common";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import { Redis } from "ioredis";

@Injectable()
export class RedisService {
  constructor(@InjectRedis("default") private readonly redisService: Redis) {}

  async get(key: string) {}
  async set(key: string, value: string, expiryTime: number) {
    return this.redisService.set(key, value, "ex", expiryTime);
  }
}
