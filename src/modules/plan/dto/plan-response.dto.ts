import { Place, Plan, User } from '@prisma/client';

import { ApiProperty } from '@nestjs/swagger';

import { UserResponseDTO } from 'src/modules/user/dto/user.dto';

import { PlaceDTO } from './place.dto';

export class PlanResponseDTO implements Plan {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty({
        type: PlaceDTO,
    })
    place: Place;

    @ApiProperty()
    date: string;

    @ApiProperty({
        type: [UserResponseDTO],
    })
    users: User[];

    @ApiProperty()
    createdAt: Date;
}
