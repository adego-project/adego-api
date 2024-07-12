import { Prisma } from '@prisma/client';
import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanDTO implements Prisma.PlanCreateInput {
    @ApiProperty({
        example: '개학전밤샘등교팟',
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: '선린인터넷고등학교',
    })
    @IsString()
    placeName: string;

    @ApiProperty({
        example: '서울특별시 용산구 원효로97길 33-4',
    })
    @IsString()
    placeAddress: string;

    @ApiProperty({
        example: '2017-03-16T17:40:00',
    })
    @IsString()
    date: string;
}
