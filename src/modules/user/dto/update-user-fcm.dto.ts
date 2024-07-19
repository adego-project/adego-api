import { Prisma } from '@prisma/client';
import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserFCMTokenDTO implements Prisma.UserUpdateInput {
    @ApiProperty({
        required: true,
    })
    @IsString()
    FCMToken: string;
}
