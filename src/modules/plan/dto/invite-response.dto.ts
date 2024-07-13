import { Invite, Plan, User } from '@prisma/client';

import { ApiProperty } from '@nestjs/swagger';

import { UserResponseDTO } from 'src/modules/user/dto/user.dto';

import { PlanDTO } from './plan.dto';

export class InviteLinkResponseDTO {
    @ApiProperty()
    link: string;
}

export class InviteResponseDTO implements Invite {
    @ApiProperty()
    id: string;

    @ApiProperty()
    planId: string;

    @ApiProperty({
        type: UserResponseDTO,
    })
    User: User;

    @ApiProperty()
    userId: string;

    @ApiProperty({
        type: PlanDTO,
    })
    Plan: Plan;

    @ApiProperty()
    createdAt: Date;
}
