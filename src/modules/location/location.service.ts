import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import { UpdateLocationDTO } from './dto/update.dto';

@Injectable()
export class LocationService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    async updateLocationById(id: string, data: UpdateLocationDTO) {
        return this.cacheManager.set(id, data);
    }

    async getLocationById(id: string) {
        return this.cacheManager.get(id);
    }
}
