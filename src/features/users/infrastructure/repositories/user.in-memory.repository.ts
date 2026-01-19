import { Injectable } from '@nestjs/common';
import UserRepository from '../../domain/repositories/user.repository';
import User from '../../domain/entities/user.entity';

@Injectable()
export default class UserInMemoryRepository implements UserRepository {
  private users: User[] = [
    {
      id: 1,
      name: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      passwordHash: 'hashedpassword123',
    },
    {
      id: 2,
      name: 'Jane',
      lastName: 'Smith',
      username: 'janesmith',
      passwordHash: 'hashedpassword456',
    },
  ];

  getByUsername(username: string): User | null {
    const user: User | undefined = this.users.find(
      (user: User): boolean => user.username === username,
    );

    return user || null;
  }
}
