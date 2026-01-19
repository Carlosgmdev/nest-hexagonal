import { Module } from '@nestjs/common';
import AuthService from '../../application/auth.service';
import AuthController from '../controllers/auth.controller';
import UserModule from 'src/features/users/infrastructure/modules/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModule,
    JwtModule.register({
      global: true,
      secret: "secretKey",
      signOptions: { expiresIn: '365d'}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export default class AuthModule {}
      