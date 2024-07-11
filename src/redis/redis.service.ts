import { Injectable } from '@nestjs/common';
import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import redisStore from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements CacheOptionsFactory {
    constructor(private readonly configService: ConfigService) {}
    createCacheOptions(): CacheModuleOptions {
        const config: CacheModuleOptions = {
            store: redisStore,
            host: this.configService.get<string>('REDIS_HOST'),
            port: this.configService.get<string>('REDIS_PORT'),
        };
        return config;
    }
}

// @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
