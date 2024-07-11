import { HttpException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlanDTO } from './dto/create-plan.dto';

@Injectable()
export class PlanService {
    constructor(private readonly prisma: PrismaService) {}

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

        if (user.Plan) throw new HttpException('User already has a plan', 400);

        await this.prisma.plan.create({
            data: {
                ...dto,
                users: {
                    connect: {
                        id,
                    },
                },
            },
        });

        return dto;
    }
}
