import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
    constructor(private readonly configService: ConfigService) {}

    #S3PublicUrl = this.configService.get<string>('S3_PUBLIC_URL');
    #bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    private readonly client = new S3Client({
        region: this.configService.get<string>('S3_REGION'),
        credentials: {
            accessKeyId: this.configService.get<string>('S3_ACCESS_KEY'),
            secretAccessKey: this.configService.get<string>('S3_SECRET_KEY'),
        },
    });

    /**
     * 프로필 이미지를 S3에 업로드합니다.
     * @param base64Image 업로드할 이미지의 base64 문자열
     * @returns 업로드된 이미지의 URL
     */
    async uploadProfileImage(base64Image: string) {
        const buffer = Buffer.from(base64Image, 'base64');
        const key = `${crypto.randomBytes(20).toString('hex')}.png`;

        const command = new PutObjectCommand({
            Bucket: this.#bucketName,
            Key: `profile/${key}`,
            Body: buffer,
            ContentType: 'image/png',
        });

        await this.client.send(command);

        return `${this.#S3PublicUrl}/profile/${key}`;
    }
}
