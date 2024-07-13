import { User } from '@prisma/client';

import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import { PlanService } from '../plan/plan.service';
import { LocationDTO } from './dto/update.dto';

@Injectable()
export class LocationService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly planService: PlanService,
    ) {}

    async updateLocationById(id: string, data: LocationDTO) {
        return this.cacheManager.set(id, data);
    }

    /*
     * Get participants location
     * @param User
     * @returns participants location {
     *   id: UpdateLocationDTO
     * }
     */
    async getParticipantsLocation(user: User): Promise<Record<string, LocationDTO>> {
        const plan = await this.planService.getPlan(user);

        const locations = {};
        for (const user of plan.users) {
            locations[user.id] = await this.getLocationById(user.id);
        }

        return locations;
    }

    async getLocationById(id: string): Promise<LocationDTO | undefined> {
        return this.cacheManager.get(id);
    }
}
