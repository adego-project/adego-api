import { User } from '@prisma/client';

import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDTO implements Partial<User> {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty({
        nullable: true,
    })
    planId: string | null;

    @ApiProperty({
        nullable: true,
    })
    profileImage: string | null;
}
