import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GoogleUser } from 'src/model';

@Injectable()
export class GoogleService {
    constructor() {}

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
