import { Body, Controller, Post } from '@nestjs/common';
import { OAuthTokenDTO } from 'src/dto';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AppleService } from './apple.service';

@ApiTags('oauth')
@Controller('/oauth/apple')
export class AppleController {
    constructor(private readonly appleService: AppleService) {}

    @Post('login')
    // Swagger
    @ApiOperation({ summary: 'Apple oAuth login endpoint' })
    @ApiOkResponse({ description: 'Apple oAuth login success' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized (애플 사용자 정보 조회 실패)' })
    async login(@Body() dto: OAuthTokenDTO) {
        return this.appleService.login(dto);
    }
}
