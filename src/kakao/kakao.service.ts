import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { OAuthTokenDTO } from 'src/dto';
import { KakaoUserModel } from 'src/model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class KakaoService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authService: AuthService,
    ) {}

    async login(dto: OAuthTokenDTO) {
        const kakaoUser = await this.getKakaoUser(dto.access_token);
        const id = `kakao_${kakaoUser.id}`;

        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!user) {
            await this.prisma.user.create({
                data: {
                    id,
                    provider: 'kakao',
                    providerId: kakaoUser.id.toString(),
                    email: kakaoUser.kakao_account.email,
                    name: null,
                },
            });
        }

        return this.authService.createTokens(id);
    }

    async getKakaoUser(access_token: string) {
        const user: KakaoUserModel = await fetch(process.env.KAKAO_USERINFO_URL as string, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }).then((res) => (res.status === 200 ? res.json() : null));

        if (!user) {
            throw new UnauthorizedException('A02'); // A02 - 카카오 사용자 정보 조회 실패
        }

        return user;
    }
}
