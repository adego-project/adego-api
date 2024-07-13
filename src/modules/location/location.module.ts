import { Module } from '@nestjs/common';

import { PlanModule } from 'src/modules/plan';

import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
    imports: [PlanModule],
    controllers: [LocationController],
    providers: [LocationService],
})
export class LocationModule {}
