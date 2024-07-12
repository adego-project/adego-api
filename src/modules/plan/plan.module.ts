import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/common';

import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';

@Module({
    imports: [PrismaModule],
    controllers: [PlanController],
    providers: [PlanService],
})
export class PlanModule {}
