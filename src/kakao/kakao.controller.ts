import { Body, Controller, Post } from '@nestjs/common';
import { OAuthTokenDTO } from 'src/dto';
import { KakaoService } from './kakao.service';

@Controller('/oauth/kakao')
export class KakaoController {
    constructor(private readonly kakaoService: KakaoService) {}

    @Post('login')
    async login(@Body() dto: OAuthTokenDTO) {
        return this.kakaoService.login(dto);
    }
}
