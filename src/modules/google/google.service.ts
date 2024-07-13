import { OAuth2Client } from 'google-auth-library';

import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from 'src/auth/auth.service';
import { AuthType, OAuthTokenDTO } from 'src/common';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';

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
        const user = await this.authService.findUserByProvider(AuthType.google, googleUser.sub);

        if (!user)
            return this.authService
                .createUser(AuthType.google, googleUser.sub)
                .then((registeredUser) => this.authService.createTokens(registeredUser.id));

        return this.authService.createTokens(user.id);
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
