import { IsNotEmpty, IsString } from 'class-validator';

export class OAuthTokenDTO {
    @IsString()
    @IsNotEmpty()
    access_token: string;
}
