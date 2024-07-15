import { IsArray } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { LocationDTO } from './update.dto';

export class ParticipantsDTO {
    @ApiProperty({
        example: 'userid: LocationDTO[]',
    })
    @IsArray()
    'userid': LocationDTO[];
}
