import importToArray from 'import-to-array';

import { Module } from '@nestjs/common';

import * as commonModules from 'src/common/modules';
import * as providers from 'src/common/providers';
import * as modules from 'src/modules';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [...importToArray(providers), ...importToArray(modules), ...importToArray(commonModules)],
    providers: [AppService],
    controllers: [AppController],
})
export class AppModule {}
