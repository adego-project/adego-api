import { TokenPayload } from '~/src/common/dto';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async createTokens(id: string) {
        const accessToken = await this.createAccessToken(id);
        const refreshToken = await this.createRefreshToken(id);

        return { accessToken, refreshToken };
    }

    async createAccessToken(id: string): Promise<string> {
        const payload: TokenPayload = { id, type: 'access' };
        return await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXP'),
        });
    }

    async createRefreshToken(id: string): Promise<string> {
        const payload: TokenPayload = { id, type: 'refresh' };

        return await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXP'),
        });
    }
}
