import { Module } from '@nestjs/common';
import UserRepository from '../../domain/repositories/user.repository';
import UserInMemoryRepository from '../repositories/user.in-memory.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: UserRepository,
      useClass: UserInMemoryRepository
    }
  ],
  exports: [UserRepository]
})
export default class UserModule {}
