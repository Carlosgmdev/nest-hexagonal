import Email from '../../../shared/domain/vo/email.vo.js';
import User from '../../users/domain/user.entity.js';
import UserId from '../../users/domain/user-id.vo.js';
import type UserRepository from '../../users/application/ports/user-repository.port.js';
import { UserEmailAlreadyExistsError } from '../../users/application/user.errors.js';
import Password from '../domain/password.vo.js';
import { InvalidCredentialsError, UserNotFoundError } from './auth.errors.js';
import type AccessTokenIssuer from './ports/access-token-issuer.port.js';
import type IdGenerator from './ports/id-generator.port.js';
import type PasswordHasher from './ports/password-hasher.port.js';

export type RegisterUserCommand = {
  name: string;
  email: string;
  password: string;
};

export type LoginCommand = {
  email: string;
  password: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
};

export default class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly accessTokenIssuer: AccessTokenIssuer,
    private readonly idGenerator: IdGenerator,
  ) {}

  async register(command: RegisterUserCommand): Promise<UserProfile> {
    const email = Email.create(command.email);
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new UserEmailAlreadyExistsError();
    }

    const password = Password.create(command.password);

    const user = User.create({
      id: UserId.create(this.idGenerator.generate()),
      name: command.name,
      email,
      passwordHash: await this.passwordHasher.hash(password.toString()),
    });

    await this.userRepository.save(user);
    return this.toProfile(user);
  }

  async login(command: LoginCommand): Promise<{ access_token: string }> {
    let email: Email;

    try {
      email = Email.create(command.email);
    } catch {
      throw new InvalidCredentialsError();
    }

    const user = await this.userRepository.findByEmail(email);

    const passwordMatches = await this.passwordHasher.compare(
      command.password,
      user?.getPasswordHash() ?? null,
    );

    if (!user || !passwordMatches) {
      throw new InvalidCredentialsError();
    }

    return {
      access_token: await this.accessTokenIssuer.issue({
        subject: user.getId().toString(),
      }),
    };
  }

  async getProfile(userId: string): Promise<UserProfile> {
    const user = await this.userRepository.findById(UserId.create(userId));

    if (!user) {
      throw new UserNotFoundError();
    }

    return this.toProfile(user);
  }

  private toProfile(user: User): UserProfile {
    return {
      id: user.getId().toString(),
      name: user.getName(),
      email: user.getEmail().toString(),
    };
  }
}
