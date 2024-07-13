import { $Enums, Plan } from '@prisma/client';

import { ApiProperty } from '@nestjs/swagger';

export class PlanDTO implements Plan {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    date: string;

    @ApiProperty()
    status: $Enums.PlanStatus;

    @ApiProperty()
    createdAt: Date;
}
