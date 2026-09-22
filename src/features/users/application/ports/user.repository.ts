import type Email from '../../../../shared/domain/vo/email.vo.js';
import type User from '../../domain/user.entity.js';
import type UserId from '../../domain/user-id.vo.js';

export default interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
}
