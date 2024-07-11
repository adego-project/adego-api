import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private readonly configService: ConfigService) {
        super({
            datasources: {
                db: {
                    url: configService.get<string>('DATABASE_URL'),
                },
            },
        });
    }

    async findUserById(id: string) {
        return this.user.findUnique({
            where: {
                id,
            },
        });
    }

    async userCreate(data: Prisma.UserCreateInput) {
        return this.user.create({
            data,
        });
    }
}
