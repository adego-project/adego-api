import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InviteStatus, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlanDTO } from './dto/create-plan.dto';
import { InviteUserDTO } from './dto/invite-user.dto';

@Injectable()
export class PlanService {
    constructor(private readonly prisma: PrismaService) {}

    async getPlan(user: User) {
        const plan = await this.prisma.plan.findFirst({
            where: {
                users: {
                    some: {
                        id: user.id,
                    },
                },
            },
            include: {
                users: true,
            },
        });

        if (!plan) throw new HttpException('User does not have a plan', HttpStatus.NOT_FOUND);

        return plan;
    }

    async createPlan({ id }: User, dto: CreatePlanDTO) {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                Plan: true,
            },
        });

        if (!user) return;

        if (user.Plan) throw new HttpException('User already has a plan', HttpStatus.BAD_GATEWAY);

        return await this.prisma.plan.create({
            data: {
                ...dto,
                users: {
                    connect: {
                        id,
                    },
                },
            },
            include: {
                users: true,
            },
        });
    }

    async getInvite({ id }: User) {
        const invites = await this.prisma.invite.findMany({
            where: {
                userId: id,
            },
            include: {
                Plan: true,
            },
        });

        return invites;
    }

    async inviteUser({ id }: User, dto: InviteUserDTO) {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                Plan: true,
            },
        });

        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        if (!user.Plan) throw new HttpException('User does not have a plan', HttpStatus.BAD_GATEWAY);

        const targetUser = await this.prisma.user.findUnique({
            where: {
                id: dto.userId,
            },
            include: {
                Plan: true,
            },
        });

        if (!targetUser) throw new HttpException('Target user not found', HttpStatus.NOT_FOUND);
        if (targetUser.planId) throw new HttpException('Target user already has a plan', HttpStatus.BAD_GATEWAY);

        return await this.prisma.invite.create({
            data: {
                userId: dto.userId,
                planId: user.planId,
                status: InviteStatus.PENDING,
            },
        });
    }
}
