import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateLocationDTO {
    @ApiProperty({
        example: '33.511111',
    })
    @IsString()
    lat: string;

    @ApiProperty({
        example: '126.492778',
    })
    @IsString()
    lng: string;
}
