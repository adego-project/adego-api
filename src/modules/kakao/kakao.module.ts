import { Module } from '@nestjs/common';

import { AuthModule } from 'src/auth';
import { PrismaModule } from 'src/common';

import { KakaoController } from './kakao.controller';
import { KakaoService } from './kakao.service';

@Module({
    imports: [PrismaModule, AuthModule],
    providers: [KakaoService],
    controllers: [KakaoController],
})
export class KakaoModule {}
