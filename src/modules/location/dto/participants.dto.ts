import { IsArray } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { LocationDTO } from './update.dto';

export class ParticipantsDTO {
    @ApiProperty({
        example: {
            lat: '33.511111',
            lng: '126.492778',
        },
        type: [LocationDTO],
    })
    @IsArray()
    'userid': LocationDTO;
}
