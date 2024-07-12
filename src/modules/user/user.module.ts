import { Module } from '@nestjs/common';

import { PrismaModule, S3Module } from 'src/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [PrismaModule, S3Module],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
