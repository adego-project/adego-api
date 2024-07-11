import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponseDto {
    @ApiProperty()
    token: string;
}

export class OAuthResponseDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;
}
