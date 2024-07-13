import { Prisma } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDTO implements Prisma.UserUpdateInput {
    @ApiProperty({
        nullable: true,
    })
    @IsString()
    @IsOptional()
    name?: string | null;
}
