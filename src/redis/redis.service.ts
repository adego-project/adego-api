import { Injectable } from '@nestjs/common';
import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import redisStore from 'cache-manager-redis-store';

@Injectable()
export class RedisService implements CacheOptionsFactory {
    createCacheOptions(): CacheModuleOptions {
        const config: CacheModuleOptions = {
            store: redisStore,
            host: 'localhost',
            port: 6379,
        };
        return config;
    }
}

// @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
