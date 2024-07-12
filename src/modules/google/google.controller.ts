import { OAuthTokenDTO } from '~/src/common/dto';
import { OAuthResponseDTO } from '~/src/common/dto/token.dto';

import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { GoogleService } from './google.service';

@ApiTags('oauth')
@Controller('/oauth/google')
export class GoogleController {
    constructor(private readonly googleService: GoogleService) {}

    @Post('login')
    // Swagger
    @ApiOperation({ summary: 'Google oAuth login endpoint' })
    @ApiOkResponse({ description: 'Google oAuth login success', type: OAuthResponseDTO })
    @ApiUnauthorizedResponse({ description: 'Unauthorized (구글 사용자 정보 조회 실패)' })
    async login(@Body() dto: OAuthTokenDTO) {
        return this.googleService.login(dto);
    }
}
