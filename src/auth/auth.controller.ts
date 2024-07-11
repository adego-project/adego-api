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
import { RefreshResponseDTO } from 'src/dto/token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('refresh')
    @UseGuards(AuthGuard('refresh')) // Passport
    // Swagger
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Access token refresh endpoint' })
    @ApiOkResponse({ description: 'Access token refresh success', type: RefreshResponseDTO })
    @ApiUnauthorizedResponse({ description: 'Unauthorized (토큰이 없음 / 잘못된 토큰 요청)' })
    async refresh(@Req() req: any): Promise<RefreshResponseDTO> {
        return { accessToken: await this.authService.createAccessToken(req.user.id) };
    }
}
