import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OAuthTokenDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    access_token: string;
}
