import { OAuthTokenDTO } from '~/src/common/dto';
import { AuthType, KakaoUserModel } from '~/src/common/models';
import { AuthService } from '~/src/modules/auth/auth.service';
import { PrismaService } from '~/src/modules/prisma/prisma.service';

import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class KakaoService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authService: AuthService,
    ) {}

    async login(dto: OAuthTokenDTO) {
        const kakaoUser = await this.getKakaoUser(dto.accessToken);
        const id = `kakao_${kakaoUser.id}`;

        const user = await this.prisma.findUserById(id);

        if (!user) {
            await this.prisma.userCreate({
                id,
                provider: AuthType.kakao,
                providerId: kakaoUser.id.toString(),
                name: null,
            });
        }

        return this.authService.createTokens(id);
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
