import { InviteStatus, Plan, PlanStatus, User } from '@prisma/client';
import { DateTime } from 'luxon';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { FirebaseService } from 'src/common/modules/firebase/firebase.service';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';

import { AddressService } from '../address/address.service';
import { CreatePlanDTO } from './dto/create-plan.dto';
import { PlanResponseDTO } from './dto/plan-response.dto';

@Injectable()
export class PlanService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly firebase: FirebaseService,
        private readonly addressService: AddressService,
    ) {}

    async getPlan(user: User): Promise<PlanResponseDTO> {
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
                place: true,
            },
        });

        if (!plan) throw new HttpException('User does not have a plan', HttpStatus.NOT_FOUND);

        return { ...plan, isAlarmAvailable: await this.isAlarmAvailable(plan.date) };
    }

    async createPlan({ id }: User, dto: CreatePlanDTO): Promise<PlanResponseDTO> {
        if (DateTime.fromISO(dto.date) < DateTime.now())
            throw new HttpException('Invalid date', HttpStatus.BAD_REQUEST);

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

        await this.prisma.invite.deleteMany({
            where: {
                userId: id,
            },
        });

        const place = await this.addressService.getAddressByKeyword(dto.address);

        return {
            ...(await this.prisma.plan.create({
                data: {
                    date: dto.date,
                    name: dto.name,
                    users: {
                        connect: {
                            id,
                        },
                    },
                    place: {
                        create: {
                            address: dto.address,
                            name: place.documents[0].place_name,
                            x: place.documents[0].x,
                            y: place.documents[0].y,
                        },
                    },
                },
                include: {
                    users: true,
                    place: true,
                },
            })),
            isAlarmAvailable: await this.isAlarmAvailable(dto.date),
        };
    }

    async deletePlan({ id }: User): Promise<PlanResponseDTO> {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });

        const plan = await this.prisma.plan.findFirst({
            where: {
                users: {
                    some: {
                        id,
                    },
                },
            },
            include: {
                users: true,
            },
        });

        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        if (!plan) throw new HttpException('User does not have a plan', HttpStatus.BAD_GATEWAY);

        const res =
            plan.users.length === 1
                ? await this.prisma.plan.delete({
                      where: {
                          id: plan.id,
                      },
                      include: {
                          users: true,
                          place: true,
                      },
                  })
                : await this.prisma.plan.update({
                      where: {
                          id: plan.id,
                      },
                      data: {
                          users: {
                              disconnect: {
                                  id,
                              },
                          },
                      },
                      include: {
                          users: true,
                          place: true,
                      },
                  });

        return { ...res, isAlarmAvailable: await this.isAlarmAvailable(res.date) };
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

    async inviteUser({ id }: User, userId: string) {
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
                id: userId,
            },
            include: {
                Plan: true,
            },
        });

        if (!targetUser) throw new HttpException('Target user not found', HttpStatus.NOT_FOUND);
        if (targetUser.planId) throw new HttpException('Target user already has a plan', HttpStatus.BAD_GATEWAY);

        return await this.prisma.invite.create({
            data: {
                userId: userId,
                planId: user.planId,
                status: InviteStatus.PENDING,
            },
        });
    }

    async acceptInvite({ id }: User, inviteId: string) {
        const invite = await this.prisma.invite.findUnique({
            where: {
                id: inviteId,
            },
            include: {
                Plan: true,
                User: true,
            },
        });

        if (!invite) throw new HttpException('Invite not found', HttpStatus.NOT_FOUND);
        if (invite.userId !== id) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

        await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                planId: invite.planId,
            },
        });

        await this.prisma.invite.deleteMany({
            where: {
                userId: id,
            },
        });

        return invite.Plan;
    }

    async rejectInvite({ id }: User, inviteId: string) {
        const invite = await this.prisma.invite.findUnique({
            where: {
                id: inviteId,
            },
            include: {
                Plan: true,
                User: true,
            },
        });

        if (!invite) throw new HttpException('Invite not found', HttpStatus.NOT_FOUND);
        if (invite.userId !== id) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

        await this.prisma.invite.delete({
            where: {
                id: inviteId,
            },
        });

        return invite.Plan;
    }

    async isAlarmAvailable(date: string) {
        return Math.abs(DateTime.fromISO(date).diffNow('minutes').minutes) <= 30;
    }

    async sendAlarmManual(user: User, plan: Plan, targetUserId: string) {
        const targetUser = await this.prisma.user.findUnique({
            where: {
                id: targetUserId,
            },
        });
        if (!targetUser) throw new HttpException('Target user not found', HttpStatus.NOT_FOUND);
        if (targetUser.planId !== plan.id)
            throw new HttpException('User is not in the same plan', HttpStatus.BAD_GATEWAY);

        if (!this.isAlarmAvailable(plan.date))
            throw new HttpException('Plan is not in 30 minutes', HttpStatus.BAD_REQUEST);

        const targetUserFCMToken = targetUser.FCMToken;
        if (!targetUserFCMToken)
            throw new HttpException('Target user does not have an FCM token', HttpStatus.BAD_REQUEST);

        const fcmRes = this.firebase.sendNotificationByToken({
            title: `${user.name}님이 알림을 울렸어요!`,
            body: '빨리 약속에 참석해주세요!',
            token: targetUserFCMToken,
        });
        if (!fcmRes) throw new HttpException('Failed to send FCM', HttpStatus.INTERNAL_SERVER_ERROR);

        return true;
    }

    async sendAlarmAuto() {
        const plans = await this.prisma.plan.findMany({
            where: {
                status: PlanStatus.WAITING,
            },
            include: {
                users: true,
            },
        });

        for (const plan of plans) {
            if (this.isAlarmAvailable(plan.date)) {
                for (const user of plan.users) {
                    const fcmRes = this.firebase.sendNotificationByToken({
                        title: '약속 시간이 얼마 남지 않았어요!',
                        body: '빨리 약속에 참석해주세요!',
                        token: user.FCMToken,
                    });
                    if (!fcmRes) throw new HttpException('Failed to send FCM', HttpStatus.INTERNAL_SERVER_ERROR);
                }

                await this.prisma.plan.update({
                    where: {
                        id: plan.id,
                    },
                    data: {
                        status: PlanStatus.ALARMED,
                    },
                });
            }
        }
    }
}
