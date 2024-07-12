import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UploadProfileImageDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    profileImage: string;
}
