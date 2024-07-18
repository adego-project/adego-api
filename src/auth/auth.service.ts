import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AuthType, TokenPayload } from 'src/common';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async createUser(provider: AuthType, providerId?: string) {
        return await this.prisma.user.create({
            data: {
                id: randomUUID(),
                provider,
                providerId: providerId || randomUUID(),
            },
        });
    }

    async findUserById(id: string) {
        return this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }

    async findUserByProvider(provider: AuthType, providerId: string) {
        return this.prisma.user.findFirst({
            where: {
                provider,
                providerId,
            },
        });
    }

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
