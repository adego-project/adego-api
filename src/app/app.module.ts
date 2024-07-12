import { redisStore } from 'cache-manager-redis-yet';
import importToArray from 'import-to-array';
import { RedisClientOptions } from 'redis';

import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { validate } from 'src/common';
import * as commonModules from 'src/common/modules';
import * as modules from 'src/modules';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
            validate,
            validationOptions: {
                abortEarly: true,
            },
        }),
        CacheModule.registerAsync<RedisClientOptions>({
            imports: [ConfigModule],
            isGlobal: true,
            useFactory: async (config: ConfigService) => ({
                store: await redisStore({
                    socket: {
                        host: config.get('REDIS_HOST'),
                        port: config.get('REDIS_PORT'),
                    },
                }),
            }),
            inject: [ConfigService],
        }),
        ...importToArray(modules),
        ...importToArray(commonModules),
    ],
    providers: [AppService],
    controllers: [AppController],
})
export class AppModule {}
