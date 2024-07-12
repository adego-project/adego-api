import { User } from '@prisma/client';

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { CurrentUser } from 'src/common';

import { LocationDTO } from './dto/update.dto';
import { LocationService } from './location.service';

@ApiTags('location')
@Controller('location')
export class LocationController {
    constructor(private readonly locationService: LocationService) {}

    @Get('participants')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('access'))
    @ApiOperation({ summary: "Get participants' locations"})
    @ApiOkResponse({ description: 'Success', type: Boolean })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiNotFoundResponse({ description: 'Plan Not Found' })
    async getParticipantsLocation(@CurrentUser() user: User) {
        return this.locationService.getParticipantsLocation(user);
    }

    @Post('update')
    @ApiBearerAuth()
    @ApiBody({
        type: LocationDTO,
    })
    @UseGuards(AuthGuard('access'))
    @ApiOperation({ summary: 'Update User Location' })
    @ApiOkResponse({ description: 'Updated User Location', type: Boolean })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async updateLocation(@CurrentUser() user: User, @Body() dto: LocationDTO) {
        await this.locationService.updateLocationById(user.id, dto);
        return true;
    }
}
