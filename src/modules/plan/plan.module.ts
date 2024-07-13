import { Module } from '@nestjs/common';

import { FirebaseModule, PrismaModule } from 'src/common';
import { AddressModule } from 'src/modules/address';

import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';

@Module({
    imports: [PrismaModule, FirebaseModule, AddressModule],
    controllers: [PlanController],
    providers: [PlanService],
    exports: [PlanService],
})
export class PlanModule {}
