import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { KakaoModule } from './kakao/kakao.module';
import { GoogleModule } from './google/google.module';
import { AppleModule } from './apple/apple.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        KakaoModule,
        GoogleModule,
        AppleModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
            validate,
            validationOptions: {
                abortEarly: true,
            },
        }),
        AuthModule,
    ],
    providers: [AppService],
    controllers: [AppController],
})
export class AppModule {}
