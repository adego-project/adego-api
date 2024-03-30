import { IsNotEmpty, IsString } from 'class-validator';

export class UserModel {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    provider: string;

    @IsString()
    @IsNotEmpty()
    providerId: string;

    email: string | null;

    name: string | null;
}
