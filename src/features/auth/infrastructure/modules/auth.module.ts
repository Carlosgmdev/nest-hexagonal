import { Module } from '@nestjs/common';
import AuthService from '../../application/auth.service';
import AuthController from '../controllers/auth.controller';
import UserModule from 'src/features/users/infrastructure/modules/user.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET') || "default_secret",
        signOptions: { 
          expiresIn: configService.get('JWT_EXPIRES_IN') || '1h'
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export default class AuthModule {}
      