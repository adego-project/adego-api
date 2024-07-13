import { ApiProperty } from '@nestjs/swagger';

export class OAuthResponseDTO {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;
}
