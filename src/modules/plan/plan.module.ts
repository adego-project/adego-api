import { Module } from '@nestjs/common';

import { FirebaseModule, PrismaModule } from 'src/common';

import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';

@Module({
    imports: [PrismaModule, FirebaseModule],
    controllers: [PlanController],
    providers: [PlanService],
    exports: [PlanService],
})
export class PlanModule {}
