import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RefreshJwtStrategy } from './strategy/refreshToken.strategy';

@Module({
    imports: [JwtModule.register({}), PassportModule],
    providers: [AuthService, RefreshJwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
