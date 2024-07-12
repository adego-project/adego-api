import { PrismaModule } from '~/src/modules/prisma/prisma.module';
import { S3Module } from '~/src/modules/s3/s3.module';

import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [PrismaModule, S3Module],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
