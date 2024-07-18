import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { AuthType, OAuthResponseDTO } from 'src/common';

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

    @Post('test-account')
    @ApiOperation({ summary: 'Create test account' })
    @ApiOkResponse({ description: 'Test account created', type: OAuthResponseDTO })
    async createTestAccount(): Promise<OAuthResponseDTO> {
        const user = await this.authService.createUser(AuthType.test);

        return await this.authService.createTokens(user.id);
    }
}
