import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponseDto {
    @ApiProperty()
    token: string;
}

export class OAuthResponseDto {
    @ApiProperty()
    access_token: string;

    @ApiProperty()
    refresh_token: string;
}
