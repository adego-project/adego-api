import { User } from '@prisma/client';
import { CurrentUser } from '~/src/common/decorators/user.decorator';

import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { UpdateLocationDTO } from './dto/update.dto';
import { LocationService } from './location.service';

@ApiTags('location')
@Controller('location')
export class LocationController {
    constructor(private readonly locationService: LocationService) {}

    @Post()
    @ApiBearerAuth()
    @ApiBody({
        type: UpdateLocationDTO,
    })
    @UseGuards(AuthGuard('access'))
    @ApiOperation({ summary: 'Update User Location' })
    @ApiOkResponse({ description: 'Updated User Location', type: Boolean })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async updateLocation(@CurrentUser() user: User, @Body() dto: UpdateLocationDTO) {
        await this.locationService.updateLocationById(user.id, dto);
        return true;
    }
}
