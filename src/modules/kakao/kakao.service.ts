import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from 'src/auth/auth.service';
import { AuthType, KakaoUserModel, OAuthTokenDTO } from 'src/common';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';

@Injectable()
export class KakaoService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authService: AuthService,
    ) {}

    async login(dto: OAuthTokenDTO) {
        const kakaoUser = await this.getKakaoUser(dto.accessToken);
        const user = await this.authService.findUserByProvider(AuthType.kakao, kakaoUser.id.toString());

        if (!user)
            return this.authService
                .createUser(AuthType.kakao, kakaoUser.id.toString())
                .then((registeredUser) => this.authService.createTokens(registeredUser.id));

        return this.authService.createTokens(user.id);
    }

    async getKakaoUser(accessToken: string) {
        const user: KakaoUserModel = await fetch('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }).then((res) => (res.status === 200 ? res.json() : null));

        if (!user) {
            throw new UnauthorizedException('A02'); // A02 - 카카오 사용자 정보 조회 실패
        }

        return user;
    }
}
