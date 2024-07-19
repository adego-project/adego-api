import { User } from '@prisma/client';

import { Body, Controller, Delete, Get, Param, Patch, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { CurrentUser, ResponseDTO } from 'src/common';

import { UpdateUserFCMTokenDTO } from './dto/update-user-fcm.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
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
    async getUser(@Req() req: any): Promise<UserResponseDTO> {
        return await this.userService.findUserById(req.user.id);
    }

    @Patch('/')
    @UseGuards(AuthGuard('access'))
    @ApiBearerAuth()
    @ApiBody({
        type: UpdateUserDTO,
    })
    @ApiOperation({ summary: 'Update user information' })
    @ApiOkResponse({
        description: 'User information updated',
        type: ResponseDTO<null>,
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async updateUser(@CurrentUser() user: User, @Body() data: UpdateUserDTO): Promise<ResponseDTO<null>> {
        try {
            await this.userService.updateUserById(user.id, data);
            return { status: 'success', data: null };
        } catch (error) {
            return { status: 'error', data: null };
        }
    }

    @Get('/:userId')
    @UseGuards(AuthGuard('access'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user information by id' })
    @ApiOkResponse({ description: 'User information', type: UserResponseDTO })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async getUserById(@Param('userId') userId: string): Promise<UserResponseDTO> {
        return await this.userService.findUserById(userId);
    }

    @Put('/fcm')
    @UseGuards(AuthGuard('access'))
    @ApiBearerAuth()
    @ApiBody({
        type: UpdateUserFCMTokenDTO,
    })
    @ApiOperation({ summary: 'Update user FCM token' })
    @ApiOkResponse({
        description: 'User FCM token updated',
        type: ResponseDTO<null>,
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async updateUserFCMToken(
        @CurrentUser() user: User,
        @Body() data: UpdateUserFCMTokenDTO,
    ): Promise<ResponseDTO<null>> {
        try {
            await this.userService.updateUserFCMTokenById(user.id, data.FCMToken);
            return { status: 'success', data: null };
        } catch (error) {
            return { status: 'error', data: null };
        }
    }

    @Put('/profile-image')
    @UseGuards(AuthGuard('access'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user profile image' })
    @ApiOkResponse({ description: 'User profile image updated', type: ResponseDTO<null> })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async updateUserProfileImage(@CurrentUser() user: User, @Body() dto: UploadProfileImageDTO) {
        try {
            await this.userService.updateUserProfileImageById(user.id, dto.profileImage);
            return { status: 'success', data: null };
        } catch (error) {
            return { status: 'error', data: null };
        }
    }

    @Delete('/')
    @UseGuards(AuthGuard('access'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete user' })
    @ApiOkResponse({ description: 'User deleted', type: ResponseDTO<null> })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async deleteUser(@CurrentUser() user: User) {
        try {
            await this.userService.deleteUserById(user.id);
            return { status: 'success', data: null };
        } catch (error) {
            return { status: 'error', data: null };
        }
    }
}
