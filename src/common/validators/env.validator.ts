import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
    @IsString()
    @IsNotEmpty()
    DATABASE_URL: string;

    @IsString()
    @IsNotEmpty()
    JWT_SECRET: string;

    @IsString()
    @IsNotEmpty()
    JWT_ACCESS_TOKEN_EXP: string;

    @IsString()
    @IsNotEmpty()
    JWT_REFRESH_TOKEN_EXP: string;

    @IsString()
    @IsNotEmpty()
    REDIS_HOST: string;

    @IsString()
    @IsNotEmpty()
    REDIS_PORT: string;

    @IsString()
    @IsNotEmpty()
    S3_PUBLIC_URL: string;

    @IsString()
    @IsNotEmpty()
    S3_BUCKET_NAME: string;

    @IsString()
    @IsNotEmpty()
    S3_REGION: string;

    @IsString()
    @IsNotEmpty()
    S3_ACCESS_KEY: string;

    @IsString()
    @IsNotEmpty()
    S3_SECRET_KEY: string;

    @IsString()
    @IsNotEmpty()
    KAKAO_REST_API_KEY: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}
