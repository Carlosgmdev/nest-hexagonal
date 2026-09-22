import type Email from '../../../shared/domain/vo/email.vo.js';
import type User from '../../users/domain/user.entity.js';
import type UserId from '../../users/domain/user-id.vo.js';
import type UserRepository from '../../users/application/ports/user.repository.js';
import { UserEmailAlreadyExistsError } from '../../users/application/user.errors.js';
import AuthService from './auth.service.js';
import { InvalidCredentialsError } from './auth.errors.js';
import type AccessTokenIssuer from './ports/access-token-issuer.js';
import type IdGenerator from './ports/id-generator.js';
import type PasswordHasher from './ports/password-hasher.js';

class FakeUserRepository implements UserRepository {
  readonly users: User[] = [];

  async findById(id: UserId): Promise<User | null> {
    return this.users.find((user) => user.getId().equals(id)) ?? null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    return this.users.find((user) => user.getEmail().equals(email)) ?? null;
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}

const comparePassword = vi.fn(
  async (plainText: string, hash: string | null): Promise<boolean> =>
    hash === `hashed:${plainText}`,
);

const passwordHasher: PasswordHasher = {
  hash: async (plainText) => `hashed:${plainText}`,
  compare: comparePassword,
};

const tokenIssuer: AccessTokenIssuer = {
  issue: async ({ subject }) => `token-for:${subject}`,
};

const idGenerator: IdGenerator = {
  generate: () => '38a6c1b9-d2f8-4491-8214-54704ce0b23b',
};

describe('AuthService', () => {
  let users: FakeUserRepository;
  let service: AuthService;

  beforeEach(() => {
    comparePassword.mockClear();
    users = new FakeUserRepository();
    service = new AuthService(users, passwordHasher, tokenIssuer, idGenerator);
  });

  it('registers a normalized user without exposing its password hash', async () => {
    const profile = await service.register({
      name: 'Carlos',
      email: ' CARLOS@Example.com ',
      password: 'a-secure-password',
    });

    expect(profile).toEqual({
      id: idGenerator.generate(),
      name: 'Carlos',
      email: 'carlos@example.com',
    });
    expect(users.users[0]?.getPasswordHash()).toBe('hashed:a-secure-password');
  });

  it('rejects duplicate users', async () => {
    const command = {
      name: 'Carlos',
      email: 'carlos@example.com',
      password: 'a-secure-password',
    };

    await service.register(command);
    await expect(service.register(command)).rejects.toBeInstanceOf(
      UserEmailAlreadyExistsError,
    );
  });

  it('rejects passwords shorter than the domain policy', async () => {
    await expect(
      service.register({
        name: 'Carlos',
        email: 'carlos@example.com',
        password: 'too-short',
      }),
    ).rejects.toThrow('La contraseña debe contener entre 15 y 128 caracteres.');
  });

  it('issues a token for valid credentials', async () => {
    await service.register({
      name: 'Carlos',
      email: 'carlos@example.com',
      password: 'a-secure-password',
    });

    await expect(
      service.login({
        email: 'carlos@example.com',
        password: 'a-secure-password',
      }),
    ).resolves.toEqual({ access_token: `token-for:${idGenerator.generate()}` });
  });

  it('uses the same error for an unknown user and a wrong password', async () => {
    await expect(
      service.login({ email: 'nobody@example.com', password: 'password' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
    expect(comparePassword).toHaveBeenCalledWith('password', null);

    await service.register({
      name: 'Carlos',
      email: 'carlos@example.com',
      password: 'a-secure-password',
    });

    await expect(
      service.login({
        email: 'carlos@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
