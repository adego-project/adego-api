import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class OAuthTokenDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    accessToken: string;
}
