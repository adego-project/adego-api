import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { PrismaService } from 'src/common/modules/prisma/prisma.service';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'access') {
    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET'),
            ignoreExpiration: false,
        });
    }

    async validate(payload: any) {
        if (payload.type !== 'access') {
            throw new UnauthorizedException('A01'); // A01 - 리프레시 토큰 아님
        }
        const user = await this.prisma.user.findUnique({
            where: { id: payload.id },
        });
        if (!user) {
            throw new UnauthorizedException('A02'); // A02 - 유저 없음
        }
        return user;
    }
}
