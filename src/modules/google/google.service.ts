import { OAuth2Client } from 'google-auth-library';
import { OAuthTokenDTO } from '~/src/common/dto';
import { AuthType } from '~/src/common/models';
import { AuthService } from '~/src/modules/auth/auth.service';
import { PrismaService } from '~/src/modules/prisma/prisma.service';

import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class GoogleService {
    private readonly oAuth2Client: OAuth2Client;

    constructor(
        private readonly prisma: PrismaService,
        private readonly authService: AuthService,
    ) {
        this.oAuth2Client = new OAuth2Client();
    }

    async login(dto: OAuthTokenDTO) {
        const googleUser = await this.getGoogleUser(dto.accessToken);
        const id = `google_${googleUser.sub}`;

        const user = await this.prisma.findUserById(id);

        if (!user) {
            await this.prisma.userCreate({
                id,
                provider: AuthType.google,
                providerId: googleUser.sub,
                name: null,
            });
        }

        return this.authService.createTokens(id);
    }

    async getGoogleUser(accessToken: string) {
        // const user: GoogleUser = await fetch(
        //     `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`,
        // ).then((res) => (res.status === 200 ? res.json() : null));
        const ticket = await this.oAuth2Client.verifyIdToken({
            idToken: accessToken,
        });
        const payload = ticket.getPayload();

        if (!payload) {
            throw new UnauthorizedException('A03'); // A03 - 구글 사용자 정보 조회 실패
        }

        return payload;
    }
}
