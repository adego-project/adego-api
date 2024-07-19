import { User } from '@prisma/client';
import { Request, Response } from 'express';

import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { CurrentUser } from 'src/common';

import { CreatePlanDTO } from './dto/create-plan.dto';
import { InviteLinkResponseDTO, InviteResponseDTO } from './dto/invite-response.dto';
import { PlanResponseDTO } from './dto/plan-response.dto';
import { PlanService } from './plan.service';

@ApiTags('plan')
@Controller('plan')
export class PlanController {
    constructor(
        private readonly planService: PlanService,
        private readonly configService: ConfigService,
    ) {}

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

    @Delete()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('access'))
    @ApiOperation({ summary: 'Delete a plan' })
    @ApiOkResponse({ description: 'Plan deleted', type: PlanResponseDTO })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async deletePlan(@CurrentUser() user: User): Promise<PlanResponseDTO> {
        return await this.planService.deletePlan(user);
    }

    @Get('invite/:inviteId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('access'))
    @ApiOperation({ summary: 'Get plan invite' })
    @ApiOkResponse({ description: 'Plan invite', type: InviteResponseDTO })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async getInvite(@CurrentUser() user: User, @Param('inviteId') inviteId: string): Promise<InviteResponseDTO> {
        return await this.planService.getInvite(inviteId);
    }

    @Post('invite')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('access'))
    @ApiOperation({ summary: 'Invite user to a plan' })
    @ApiOkResponse({ description: 'Plan invite sent', type: InviteLinkResponseDTO })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async invite(@CurrentUser() user: User): Promise<InviteLinkResponseDTO> {
        return { link: await this.planService.invite(user) };
    }

    @Get('invite/link/:inviteId')
    @ApiOperation({ summary: 'Deep link to plan invite' })
    @ApiOkResponse({ description: 'Plan invite', type: PlanResponseDTO })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async getInviteById(@Req() req: Request, @Param('inviteId') inviteId: string, @Res() res: Response) {
        if (req.headers['user-agent']?.toLocaleLowerCase().includes('kakaotalk')) {
            return res.redirect(
                `kakaotalk://web/openExternal?url=${this.configService.get<string>('BACKEND_URL')!}/plan/invite/link/${inviteId}`,
            );
        }

        res.redirect(`adego-by-seogaemo://invite?id=${inviteId}`);
    }

    @Put('invite/:inviteId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('access'))
    @ApiOperation({ summary: 'Accept a plan invite' })
    @ApiOkResponse({ description: 'Plan invite accepted', type: PlanResponseDTO })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async acceptInvite(@CurrentUser() user: User, @Param('inviteId') inviteId: string) {
        return await this.planService.acceptInvite(user, inviteId);
    }

    @Put('alert')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('access'))
    @ApiOperation({ summary: 'Send plan alert for user' })
    @ApiOkResponse({ description: 'Sent a plan alert' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async sendAlert(@CurrentUser() user: User, @Query('target') target: string) {
        return await this.planService.sendAlarmManual(user, target);
    }
}
