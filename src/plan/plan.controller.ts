import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PlanService } from './plan.service';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/decorators/user.decorator';
import { User } from '@prisma/client';
import { CreatePlanDTO } from './dto/create-plan.dto';

@Controller('plan')
export class PlanController {
    constructor(private readonly planService: PlanService) {}

    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('access'))
    @ApiOperation({ summary: 'Get user plan' })
    @ApiOkResponse({ description: 'User plan' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async getPlan(@CurrentUser() user: User) {
        return await this.planService.getPlan(user);
    }

    @Post()
    @ApiBearerAuth()
    @ApiBody({
        type: CreatePlanDTO,
    })
    @UseGuards(AuthGuard('access'))
    @ApiOperation({ summary: 'Create a plan' })
    @ApiOkResponse({ description: 'Plan created' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async createPlan(@CurrentUser() user: User, @Body() dto: CreatePlanDTO) {
        return await this.planService.createPlan(user, dto);
    }
}
