import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponseDTO {
    @ApiProperty()
    accessToken: string;
}

export class OAuthResponseDTO {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;
}
