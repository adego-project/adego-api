import { PrismaModule } from '~/src/modules/prisma/prisma.module';

import { Module } from '@nestjs/common';

import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';

@Module({
    imports: [PrismaModule],
    controllers: [PlanController],
    providers: [PlanService],
})
export class PlanModule {}
