import { Module } from '@nestjs/common';
import AuthModule from '@features/auth/infrastructure/modules/auth.module';
import UserModule from 'src/features/users/infrastructure/modules/user.module';

@Module({
  imports: [
    UserModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
