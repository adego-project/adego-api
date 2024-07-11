import { ApiProperty } from '@nestjs/swagger';
import { Plan, User } from '@prisma/client';

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

    @ApiProperty()
    users: User[];
}
