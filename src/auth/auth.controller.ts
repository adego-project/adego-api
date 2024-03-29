import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBearerAuth,
    ApiHeader,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('refresh')
    @UseGuards(AuthGuard('refresh')) // Passport
    // Swagger
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer {refresh_token}',
    })
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Access token refresh endpoint' })
    @ApiOkResponse({ description: 'Access token refresh success' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized (토큰이 없음 / 잘못된 토큰 요청)' })
    async refresh(@Req() req: any) {
        return { token: await this.authService.createAccessToken(req.user.id) };
    }
}
