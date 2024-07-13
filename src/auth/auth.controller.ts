import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { OAuthResponseDTO } from 'src/common';

import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('refresh')
    @UseGuards(AuthGuard('refresh')) // Passport
    // Swagger
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Access token refresh endpoint' })
    @ApiOkResponse({ description: 'Access token refresh success', type: OAuthResponseDTO })
    @ApiUnauthorizedResponse({ description: 'Unauthorized (토큰이 없음 / 잘못된 토큰 요청)' })
    async refresh(@Req() req: any): Promise<OAuthResponseDTO> {
        return await this.authService.createTokens(req.user.id);
    }
}
