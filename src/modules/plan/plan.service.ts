import { PlanStatus, User } from '@prisma/client';
import { DateTime } from 'luxon';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

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
        private readonly configService: ConfigService,
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

    async getInvite(inviteId: string) {
        const invite = await this.prisma.invite.findUnique({
            where: {
                id: inviteId,
            },
            include: {
                plan: {
                    include: {
                        place: true,
                    },
                },
                user: true,
            },
        });

        if (!invite) throw new HttpException('Invite not found', HttpStatus.NOT_FOUND);
        if (!invite.plan) throw new HttpException('Plan not found', HttpStatus.NOT_FOUND);

        return invite;
    }

    getInviteLink(inviteId: string) {
        return `${this.configService.get('BACKEND_URL')}/plan/invite/link/${inviteId}`;
    }

    async invite({ id }: User) {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                plan: true,
                invite: true,
            },
        });

        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        if (!user.plan) throw new HttpException('User does not have a plan', HttpStatus.BAD_GATEWAY);
        if (user.invite) return this.getInviteLink(user.invite.id);

        const invite = await this.prisma.invite.create({
            data: {
                plan: {
                    connect: {
                        id: user.plan.id,
                    },
                },
                user: {
                    connect: {
                        id,
                    },
                },
            },
        });

        return this.getInviteLink(invite.id);
    }

    async createPlan({ id }: User, dto: CreatePlanDTO) {
        if (DateTime.fromISO(dto.date).diffNow('minutes').minutes >= -30)
            throw new HttpException('Invalid date', HttpStatus.BAD_REQUEST);

        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                plan: true,
            },
        });

        if (!user) return;
        if (user.plan) throw new HttpException('User already has a plan', HttpStatus.BAD_GATEWAY);

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

    async acceptInvite({ id }: User, inviteId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        const invite = await this.prisma.invite.findUnique({
            where: {
                id: inviteId,
            },
        });

        if (!invite) throw new HttpException('Invite not found', HttpStatus.NOT_FOUND);

        const plan = await this.prisma.plan.findUnique({
            where: {
                id: invite.planId,
            },
            include: {
                users: true,
            },
        });

        if (!plan) throw new HttpException('Plan not found', HttpStatus.NOT_FOUND);
        if (plan.users.some((u) => u.id === id))
            throw new HttpException('User is already in the plan', HttpStatus.BAD_GATEWAY);

        return await this.prisma.plan.update({
            where: {
                id: plan.id,
            },
            data: {
                users: {
                    connect: {
                        id,
                    },
                },
            },
            include: {
                users: true,
                place: true,
            },
        });
    }

    async isExpired(date: string) {
        return DateTime.fromISO(date).diffNow('minutes').minutes < -30;
    }

    async isAlarmAvailable(date: string) {
        return Math.abs(DateTime.fromISO(date).diffNow('minutes').minutes) <= 30;
    }

    async sendAlarmManual(user: User, targetUserId: string) {
        const plan = await this.getPlan(user);

        const targetUser = await this.prisma.user.findUnique({
            where: {
                id: targetUserId,
            },
        });
        if (!targetUser) throw new HttpException('Target user not found', HttpStatus.NOT_FOUND);
        if (targetUser.planId !== plan.id)
            throw new HttpException('User is not in the same plan', HttpStatus.BAD_GATEWAY);

        if (!plan.isAlarmAvailable) throw new HttpException('Plan is not in 30 minutes', HttpStatus.BAD_REQUEST);

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

    @Cron(CronExpression.EVERY_MINUTE)
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
            } else if (this.isExpired(plan.date)) {
                await this.prisma.plan.delete({
                    where: {
                        id: plan.id,
                    },
                });
            }
        }
    }
}
