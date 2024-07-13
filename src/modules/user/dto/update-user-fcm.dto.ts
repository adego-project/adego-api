import { Prisma } from '@prisma/client';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserFCMTokenDTO implements Prisma.UserUpdateInput {
    @ApiProperty({
        required: true,
    })
    FCMToken: string;
}
