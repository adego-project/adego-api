import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { KakaoModule } from './kakao/kakao.module';
import { GoogleModule } from './google/google.module';
import { AppleModule } from './apple/apple.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './env.validation';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { S3Module } from './s3/s3.module';
import { PlanModule } from './plan/plan.module';
import { LocationModule } from './location/location.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { FirebaseModule } from './firebase/firebase.module';

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
