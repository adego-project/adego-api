import { Plan, User } from '@prisma/client';

import { ApiProperty } from '@nestjs/swagger';

import { UserResponseDTO } from '../../user/dto/user.dto';

export class PlanResponseDTO implements Plan {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    placeName: string;

    @ApiProperty()
    placeAddress: string;

    @ApiProperty()
    date: string;

    @ApiProperty({
        type: [UserResponseDTO],
    })
    users: User[];
}
