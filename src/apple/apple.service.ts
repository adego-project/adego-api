import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { OAuthTokenDTO } from 'src/dto';
import { AuthType } from 'src/model';
import { AppleJwtTokenPayload } from 'src/model/apple.user.model';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

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
        console.log('🚀 ~ AppleService ~ getAppleUser ~ idToken:', idToken);
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
        console.log('🚀 ~ AppleService ~ decodedToken ~ decodedToken:', decodedToken);

        const keyIdFromToken = decodedToken.header.kid;
        console.log('🚀 ~ AppleService ~ verifyAppleToken ~ keyIdFromToken:', keyIdFromToken);

        const applePublicKeyUrl = 'https://appleid.apple.com/auth/keys';
        console.log('🚀 ~ AppleService ~ verifyAppleToken ~ applePublicKeyUrl:', applePublicKeyUrl);

        const jwksClient = new JwksClient({ jwksUri: applePublicKeyUrl });
        console.log('🚀 ~ AppleService ~ verifyAppleToken ~ jwksClient:', jwksClient);

        const key = await jwksClient.getSigningKey(keyIdFromToken);
        const publicKey = key.getPublicKey();

        const verifiedDecodedToken: AppleJwtTokenPayload = jwt.verify(appleIdToken, publicKey, {
            algorithms: [decodedToken.header.alg],
        }) as AppleJwtTokenPayload;
        console.log('🚀 ~ AppleService ~ verifyAppleToken ~ verifiedDecodedToken:', verifiedDecodedToken);

        return verifiedDecodedToken;
    }
}
