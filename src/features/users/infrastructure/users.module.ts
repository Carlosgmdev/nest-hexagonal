import { Module } from '@nestjs/common';
import InMemoryUsersRepository from './in-memory-users.repository.js';
import { USER_REPOSITORY } from './users.tokens.js';

@Module({
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUsersRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export default class UsersModule {}
