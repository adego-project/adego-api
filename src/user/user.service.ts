import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async findUserById(id: string) {
        const user = await this.prisma.user.findUnique({ where: { id } });

        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        return user;
    }

    async updateUserById(id: string, data: Prisma.UserUpdateInput) {
        const user = await this.prisma.user.findUnique({ where: { id } });

        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        await this.prisma.user.update({ where: { id }, data });

        return data;
    }
}
