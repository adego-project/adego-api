import { OAuthTokenDTO } from '~/src/common/dto';
import { OAuthResponseDTO } from '~/src/common/dto/token.dto';

import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { KakaoService } from './kakao.service';

@ApiTags('oauth')
@Controller('/oauth/kakao')
export class KakaoController {
    constructor(private readonly kakaoService: KakaoService) {}

    @Post('login')
    // Swagger
    @ApiOperation({ summary: 'Kakao oAuth login endpoint' })
    @ApiOkResponse({ description: 'Kakao oAuth login success', type: OAuthResponseDTO })
    @ApiUnauthorizedResponse({ description: 'Unauthorized (카카오 사용자 정보 조회 실패)' })
    async login(@Body() dto: OAuthTokenDTO) {
        return this.kakaoService.login(dto);
    }
}
