import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { OAuthTokenDTO } from 'src/dto';
import { AuthType, GoogleUser } from 'src/model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GoogleService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authService: AuthService,
    ) {}

    async login(dto: OAuthTokenDTO) {
        const googleUser = await this.getGoogleUser(dto.access_token);
        const id = `google_${googleUser.sub}`;

        const user = await this.prisma.findUserById(id);

        if (!user) {
            await this.prisma.userCreate({
                id,
                provider: AuthType.google,
                providerId: googleUser.sub,
                email: googleUser.email,
                name: null,
            });
        }

        return this.authService.createTokens(id);
    }

    async getGoogleUser(access_token: string) {
        const user: GoogleUser = await fetch(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`,
        ).then((res) => (res.status === 200 ? res.json() : null));

        if (!user) {
            throw new UnauthorizedException('A03'); // A03 - 구글 사용자 정보 조회 실패
        }

        return user;
    }
}
