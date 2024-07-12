import { AuthModule } from '~/src/modules/auth/auth.module';
import { PrismaModule } from '~/src/modules/prisma/prisma.module';

import { Module } from '@nestjs/common';

import { AppleController } from './apple.controller';
import { AppleService } from './apple.service';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [AppleController],
    providers: [AppleService],
})
export class AppleModule {}
