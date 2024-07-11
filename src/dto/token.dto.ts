import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponseDTO {
    @ApiProperty()
    token: string;
}

export class OAuthResponseDTO {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;
}
