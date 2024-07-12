import { Module } from '@nestjs/common';

import { AuthModule } from 'src/auth';
import { PrismaModule } from 'src/common';

import { AppleController } from './apple.controller';
import { AppleService } from './apple.service';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [AppleController],
    providers: [AppleService],
})
export class AppleModule {}
