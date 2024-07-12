import { AuthModule } from '~/src/modules/auth/auth.module';
import { PrismaModule } from '~/src/modules/prisma/prisma.module';

import { Module } from '@nestjs/common';

import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';

@Module({
    imports: [PrismaModule, AuthModule],
    providers: [GoogleService],
    controllers: [GoogleController],
})
export class GoogleModule {}
