import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { OAuthTokenDTO } from 'src/dto';
import { AuthType } from 'src/model';
import { PrismaService } from 'src/prisma/prisma.service';
import verifyAppleToken from 'verify-apple-id-token';

@Injectable()
export class AppleService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    async login(dto: OAuthTokenDTO) {
        const appleUser = await this.getAppleUser(dto.access_token);
        const id = `apple_${appleUser.sub}`;

        const user = await this.prisma.findUserById(id);

        if (!user) {
            await this.prisma.userCreate({
                id,
                provider: AuthType.apple,
                providerId: appleUser.sub,
                email: appleUser.email,
                name: null,
            });
        }

        return this.authService.createTokens(id);
    }

    async getAppleUser(idToken: string) {
        try {
            const user = await verifyAppleToken({
                idToken,
                clientId: this.configService.get<string>('APPLE_CLIENT_ID'),
            });

            return user;
        } catch (e) {
            console.error('apple', e);
            throw new UnauthorizedException('A04'); // A04 - 애플 사용자 정보 조회 실패
        }
    }
}
