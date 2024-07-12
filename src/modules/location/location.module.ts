import { Module } from '@nestjs/common';

import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { PlanModule } from '../plan';

@Module({
    imports: [PlanModule],
    controllers: [LocationController],
    providers: [LocationService],
})
export class LocationModule {}
