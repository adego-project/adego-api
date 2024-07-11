import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
    imports: [PrismaModule, S3Module],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
