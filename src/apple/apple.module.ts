import { Module } from '@nestjs/common';
import { AppleController } from './apple.controller';
import { AppleService } from './apple.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [AppleController],
    providers: [AppleService],
})
export class AppleModule {}
