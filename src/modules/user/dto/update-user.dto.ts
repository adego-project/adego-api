import { Prisma } from '@prisma/client';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDTO implements Prisma.UserUpdateInput {
    @ApiProperty({
        required: false,
    })
    name?: string | null;
}
