import { Prisma } from '@prisma/client';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { S3Service } from 'src/common/modules/s3/s3.service';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly s3: S3Service,
    ) {}

    async findUserById(id: string) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        return user;
    }

    async updateUserById(id: string, data: Prisma.UserUpdateInput) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        await this.prisma.user.update({
            where: { id },
            data: {
                ...(data.name ? { name: data.name } : {}),
            },
        });

        return data;
    }

    async updateUserFCMTokenById(id: string, FCMToken: string) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        await this.prisma.user
            .update({
                where: { id },
                data: { FCMToken },
            })
            .then((res) => console.log(res));
    }

    /**
     * Update user profile image by id
     * @param id User id
     * @param base64ProfileImage Base64 encoded image
     */
    async updateUserProfileImageById(id: string, base64ProfileImage: string) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        this.s3.uploadProfileImage(base64ProfileImage).then((url) =>
            this.prisma.userProfileImage
                .create({
                    data: {
                        url,
                        user: { connect: { id } },
                    },
                })
                .then(() =>
                    this.prisma.user.update({
                        where: { id },
                        data: { profileImage: url },
                    }),
                ),
        );
    }

    async deleteUserById(id: string) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        await this.prisma.user.delete({ where: { id } });

        return user;
    }
}
