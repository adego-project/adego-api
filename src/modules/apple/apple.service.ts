import * as jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthService } from 'src/auth/auth.service';
import { AppleJwtTokenPayload, AuthType, OAuthTokenDTO } from 'src/common';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';

@Injectable()
export class AppleService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    async login(dto: OAuthTokenDTO) {
        const appleUser = await this.getAppleUser(dto.accessToken);
        const id = `apple_${appleUser.sub}`;

        const user = await this.prisma.findUserById(id);

        if (!user) {
            await this.prisma.userCreate({
                id,
                provider: AuthType.apple,
                providerId: appleUser.sub,
                name: null,
            });
        }

        return this.authService.createTokens(id);
    }

    async getAppleUser(idToken: string) {
        try {
            return this.verifyAppleToken(idToken);
        } catch (e) {
            console.error('apple', e);
            throw new UnauthorizedException('A04'); // A04 - 애플 사용자 정보 조회 실패
        }
    }

    async verifyAppleToken(appleIdToken: string): Promise<AppleJwtTokenPayload> {
        const decodedToken = jwt.decode(appleIdToken, { complete: true }) as {
            header: { kid: string; alg: jwt.Algorithm };
            payload: { sub: string };
        };

        const keyIdFromToken = decodedToken.header.kid;

        const applePublicKeyUrl = 'https://appleid.apple.com/auth/keys';

        const jwksClient = new JwksClient({ jwksUri: applePublicKeyUrl });

        const key = await jwksClient.getSigningKey(keyIdFromToken);
        const publicKey = key.getPublicKey();

        const verifiedDecodedToken: AppleJwtTokenPayload = jwt.verify(appleIdToken, publicKey, {
            algorithms: [decodedToken.header.alg],
        }) as AppleJwtTokenPayload;

        return verifiedDecodedToken;
    }
}
