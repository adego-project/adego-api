import { Prisma, User } from '@prisma/client';
import { CurrentUser } from '~/src/common/decorators/user.decorator';

import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { UploadProfileImageDTO } from './dto/upload-profile-image.dto';
import { UserResponseDTO } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/')
    @UseGuards(AuthGuard('access'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user information' })
    @ApiOkResponse({ description: 'User information', type: UserResponseDTO })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async getUser(@Req() req: any) {
        return await this.userService.findUserById(req.user.id);
    }

    @Get('/:userId')
    @UseGuards(AuthGuard('access'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user information by id' })
    @ApiOkResponse({ description: 'User information', type: UserResponseDTO })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async getUserById(@Param('userId') userId: string) {
        return await this.userService.findUserById(userId);
    }

    @Patch('/')
    @UseGuards(AuthGuard('access'))
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

    @Post('/profile-image')
    @UseGuards(AuthGuard('access'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user profile image' })
    @ApiOkResponse({ description: 'User profile image updated' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async updateUserProfileImage(@CurrentUser() user: User, @Body() dto: UploadProfileImageDTO) {
        return await this.userService.updateUserProfileImageById(user.id, dto.profileImage);
    }

    @Delete('/')
    @UseGuards(AuthGuard('access'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete user' })
    @ApiOkResponse({ description: 'User deleted', type: UserResponseDTO })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async deleteUser(@CurrentUser() user: User) {
        return await this.userService.deleteUserById(user.id);
    }
}
