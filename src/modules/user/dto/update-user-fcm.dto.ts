import { Prisma } from '@prisma/client';
import { IsString, MaxLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserFCMTokenDTO implements Prisma.UserUpdateInput {
    @ApiProperty({
        required: true,
        maxLength: 200,
    })
    @IsString()
    @MaxLength(200)
    FCMToken: string;
}
