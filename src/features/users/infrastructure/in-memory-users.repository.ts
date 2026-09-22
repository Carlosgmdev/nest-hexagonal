import type Email from '../../../shared/domain/vo/email.vo.js';
import type UserRepository from '../application/ports/user.repository.js';
import { UserEmailAlreadyExistsError } from '../application/user.errors.js';
import type User from '../domain/user.entity.js';
import type UserId from '../domain/user-id.vo.js';

export default class InMemoryUsersRepository implements UserRepository {
  private readonly users = new Map<string, User>();

  async findById(id: UserId): Promise<User | null> {
    return this.users.get(id.toString()) ?? null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.getEmail().equals(email)) return user;
    }

    return null;
  }

  async save(user: User): Promise<void> {
    for (const storedUser of this.users.values()) {
      const belongsToAnotherUser = !storedUser.getId().equals(user.getId());

      if (
        belongsToAnotherUser &&
        storedUser.getEmail().equals(user.getEmail())
      ) {
        throw new UserEmailAlreadyExistsError();
      }
    }

    this.users.set(user.getId().toString(), user);
  }
}
