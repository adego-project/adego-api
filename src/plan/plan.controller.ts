import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PlanService } from './plan.service';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/decorators/user.decorator';
import { User } from '@prisma/client';
import { CreatePlanDTO } from './dto/create-plan.dto';
import { PlanResponseDTO } from './dto/plan-reponse.dto';

@ApiTags('plan')
@Controller('plan')
export class PlanController {
    constructor(private readonly planService: PlanService) {}

    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('access'))
    @ApiOperation({ summary: 'Get user plan' })
    @ApiOkResponse({ description: 'User plan', type: PlanResponseDTO })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async getPlan(@CurrentUser() user: User): Promise<PlanResponseDTO> {
        return await this.planService.getPlan(user);
    }

    @Post()
    @ApiBearerAuth()
    @ApiBody({
        type: CreatePlanDTO,
    })
    @UseGuards(AuthGuard('access'))
    @ApiOperation({ summary: 'Create a plan' })
    @ApiOkResponse({ description: 'Plan created', type: PlanResponseDTO })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async createPlan(@CurrentUser() user: User, @Body() dto: CreatePlanDTO): Promise<PlanResponseDTO> {
        return await this.planService.createPlan(user, dto);
    }

    @Get('invite')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('access'))
    @ApiOperation({ summary: 'Get plan invite' })
    @ApiOkResponse({ description: 'Plan invite', type: PlanResponseDTO })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async getInvite(@CurrentUser() user: User) {
        return await this.planService.getInvite(user);
    }

    @Post('invite/:userId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('access'))
    @ApiOperation({ summary: 'Invite a user to the plan' })
    @ApiOkResponse({ description: 'User invited', type: PlanResponseDTO })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async inviteUser(@CurrentUser() user: User, @Param('userId') userId: string) {
        return await this.planService.inviteUser(user, userId);
    }

    @Put('accept/:inviteId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('access'))
    @ApiOperation({ summary: 'Accept a plan invite' })
    @ApiOkResponse({ description: 'Plan invite accepted', type: PlanResponseDTO })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async acceptInvite(@CurrentUser() user: User, @Param('inviteId') inviteId: string) {
        return await this.planService.acceptInvite(user, inviteId);
    }

    @Delete('invite/:inviteId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('access'))
    @ApiOperation({ summary: 'Decline a plan invite' })
    @ApiOkResponse({ description: 'Plan invite reject', type: PlanResponseDTO })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async rejectInvite(@CurrentUser() user: User, @Param('inviteId') inviteId: string) {
        return await this.planService.rejectInvite(user, inviteId);
    }
}
