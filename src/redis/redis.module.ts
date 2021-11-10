import { Global, Module } from "@nestjs/common";
import { RedisModule as RedisClientModule } from "@liaoliaots/nestjs-redis";
import { ConfigService } from "@nestjs/config";

import { RedisService } from "./redis.service";

@Global()
@Module({
  imports: [
    RedisClientModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        closeClient: true,
        readyLog: true,
        config: {
          namespace: "default",
          host: config.get("REDIS_HOSTNAME"),
          port: config.get("REDIS_PORT"),
          password: config.get("REDIS_PASSWORD"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
