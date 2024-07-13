import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanDTO {
    @ApiProperty({
        example: '개학전밤샘등교팟',
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: '서울 용산구 청파동3가 131-2',
    })
    @IsString()
    address: string;

    @ApiProperty({
        example: '2017-03-16T17:40:00',
    })
    @IsString()
    date: string;
}
