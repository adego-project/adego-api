import { Controller, Get } from '@nestjs/common';

@Controller('/oauth/kakao')
export class KakaoController {
    @Get('login')
    async login() {
        return 'kakao login';
    }
}
