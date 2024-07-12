import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessJwtStrategy } from './strategy/accessToken.strategy';
import { RefreshJwtStrategy } from './strategy/refreshToken.strategy';

@Module({
    imports: [JwtModule.register({}), PassportModule],
    providers: [AuthService, RefreshJwtStrategy, AccessJwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
