import { Body, Controller, Post } from '@nestjs/common';
import { OAuthTokenDTO } from 'src/dto';
import { GoogleService } from './google.service';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('oauth')
@Controller('/oauth/google')
export class GoogleController {
    constructor(private readonly googleService: GoogleService) {}

    @Post('login')
    // Swagger
    @ApiOperation({ summary: 'Google oAuth login endpoint' })
    @ApiOkResponse({ description: 'Google oAuth login success' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized (구글 사용자 정보 조회 실패)' })
    async login(@Body() dto: OAuthTokenDTO) {
        return this.googleService.login(dto);
    }
}
