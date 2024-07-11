import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
    ApiBearerAuth,
    ApiHeader,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/decorators/user.decorator';
import { Prisma, User } from '@prisma/client';
import { UserResponseDTO } from './dto/user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/')
    @UseGuards(AuthGuard('access'))
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer {accessToken}',
    })
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user information' })
    @ApiOkResponse({ description: 'User information', type: UserResponseDTO })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async getUser(@Req() req: any) {
        return await this.userService.findUserById(req.user.id);
    }

    @Patch('/')
    @UseGuards(AuthGuard('access'))
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer {accessToken}',
    })
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user information' })
    @ApiOkResponse({
        description: 'User information updated',
        type: UserResponseDTO,
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async updateUser(@CurrentUser() user: User, @Body() data: Prisma.UserUpdateInput) {
        return await this.userService.updateUserById(user.id, data);
    }
}
