import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = createClient({
          socket: {
            host: configService.get('redis.server.host'),
            port: configService.get('redis.server.port'),
          },
          database: configService.get('redis.server.db'),
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService], // 注入 ConfigService
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
