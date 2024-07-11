import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserResponseDto implements User {
    @ApiProperty()
    id: string;

    @ApiProperty()
    provider: string;

    @ApiProperty()
    providerId: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    name: string;
}
