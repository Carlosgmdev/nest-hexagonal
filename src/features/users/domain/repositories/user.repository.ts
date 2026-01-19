import User from '../entities/user.entity';

export default abstract class UserRepository {
  abstract getByUsername(username: string): User | null;
}
