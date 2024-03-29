import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RefreshJwtStrategy } from './strategy/refreshToken.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [JwtModule.register({}), PassportModule],
    controllers: [AuthController],
    providers: [AuthService, RefreshJwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
