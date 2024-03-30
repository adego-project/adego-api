import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { UserModel } from 'src/model';

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

    async userCreate(data: UserModel) {
        return this.user.create({
            data,
        });
    }
}
