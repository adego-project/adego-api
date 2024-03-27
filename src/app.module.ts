import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KakaoModule } from './kakao/kakao.module';
import { GoogleModule } from './google/google.module';
import { AppleModule } from './apple/apple.module';

@Module({
    imports: [KakaoModule, GoogleModule, AppleModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
