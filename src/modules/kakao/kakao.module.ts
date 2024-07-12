import { AuthModule } from '~/src/modules/auth/auth.module';
import { PrismaModule } from '~/src/modules/prisma/prisma.module';

import { Module } from '@nestjs/common';

import { KakaoController } from './kakao.controller';
import { KakaoService } from './kakao.service';

@Module({
    imports: [PrismaModule, AuthModule],
    providers: [KakaoService],
    controllers: [KakaoController],
})
export class KakaoModule {}
