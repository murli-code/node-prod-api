import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import type { StringValue } from 'ms';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        const rawExpiresIn = process.env.JWT_EXPIRES_IN;
        const expiresIn: number | StringValue = rawExpiresIn
          ? /^\d+$/.test(rawExpiresIn)
            ? Number(rawExpiresIn)
            : (rawExpiresIn as StringValue)
          : '1h';

        return {
          secret: process.env.JWT_SECRET || 'default_secret',
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
