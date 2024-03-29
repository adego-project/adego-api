import { Module } from '@nestjs/common';
import { KakaoService } from './kakao.service';
import { KakaoController } from './kakao.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [PrismaModule, AuthModule],
    providers: [KakaoService],
    controllers: [KakaoController],
})
export class KakaoModule {}
