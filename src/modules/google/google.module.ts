import { Module } from '@nestjs/common';

import { AuthModule } from 'src/auth';
import { PrismaModule } from 'src/common';

import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';

@Module({
    imports: [PrismaModule, AuthModule],
    providers: [GoogleService],
    controllers: [GoogleController],
})
export class GoogleModule {}
