import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PlanService } from './plan.service';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/decorators/user.decorator';
import { User } from '@prisma/client';
import { CreatePlanDTO } from './dto/create-plan.dto';
import { PlanResponseDTO } from './dto/plan-reponse.dto';
import { InviteUserDTO } from './dto/invite-user.dto';

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

    @Post('invite')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('access'))
    @ApiOperation({ summary: 'Invite a user to the plan' })
    @ApiOkResponse({ description: 'User invited', type: PlanResponseDTO })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async inviteUser(@CurrentUser() user: User, dto: InviteUserDTO) {
        return await this.planService.inviteUser(user, dto);
    }
}
