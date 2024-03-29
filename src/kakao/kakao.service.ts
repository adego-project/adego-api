import { Injectable } from '@nestjs/common';
import { OAuthTokenDTO } from 'src/dto';
import { KakaoUserModel } from 'src/model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class KakaoService {
    constructor(private readonly prisma: PrismaService) {}

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

        return this.generateTokenAll(id);
    }

    async generateTokenAll(id: string) {}

    async getKakaoUser(access_token: string) {
        const user: KakaoUserModel = await fetch(process.env.KAKAO_USERINFO_URL as string, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }).then((res) => res.json());

        return user;
    }
}
