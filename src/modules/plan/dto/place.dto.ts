import { Place } from '@prisma/client';

import { ApiProperty } from '@nestjs/swagger';

export class PlaceDTO implements Place {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    x: string;

    @ApiProperty()
    y: string;

    @ApiProperty()
    planId: string;
}
