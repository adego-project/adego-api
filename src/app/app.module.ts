import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';

import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { validate } from '../common/validators/env.validator';
import { AppleModule } from '../modules/apple/apple.module';
import { AuthModule } from '../modules/auth/auth.module';
import { FirebaseModule } from '../modules/firebase/firebase.module';
import { GoogleModule } from '../modules/google/google.module';
import { KakaoModule } from '../modules/kakao/kakao.module';
import { LocationModule } from '../modules/location/location.module';
import { PlanModule } from '../modules/plan/plan.module';
import { S3Module } from '../modules/s3/s3.module';
import { UserModule } from '../modules/user/user.module';
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
        KakaoModule,
        GoogleModule,
        AppleModule,
        AuthModule,
        UserModule,
        S3Module,
        // RedisModule,
        PlanModule,
        LocationModule,
        FirebaseModule,
    ],
    providers: [AppService],
    controllers: [AppController],
})
export class AppModule {}
