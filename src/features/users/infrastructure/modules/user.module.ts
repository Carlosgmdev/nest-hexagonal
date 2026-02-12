import { Module } from '@nestjs/common';
import UserRepository from '../../domain/repositories/user.repository';
import UserPostgreSQLRepository from '../adapters/user.postgresql.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: UserRepository,
      useClass: UserPostgreSQLRepository
    }
  ],
  exports: [UserRepository]
})
export default class UserModule {}
