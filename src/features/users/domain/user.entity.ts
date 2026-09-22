import Email from '../../../shared/domain/vo/email.vo.js';
import DomainValidationError from '../../../shared/domain/errors/domain-validation.error.js';
import UserId from './user-id.vo.js';

export type CreateUser = {
  id: UserId;
  name: string;
  email: Email;
  passwordHash: string;
};

export type ReconstituteUser = CreateUser;

export default class User {
  private constructor(
    private readonly id: UserId,
    private readonly name: string,
    private readonly email: Email,
    private readonly passwordHash: string,
  ) {}

  static create(params: CreateUser): User {
    const name = params.name.trim();

    if (name.length < 2 || name.length > 100) {
      throw new DomainValidationError(
        'El nombre debe contener entre 2 y 100 caracteres.',
      );
    }

    if (!params.passwordHash) {
      throw new DomainValidationError(
        'El hash de la contraseña es obligatorio.',
      );
    }

    return new User(params.id, name, params.email, params.passwordHash);
  }

  static reconstitute(params: ReconstituteUser): User {
    return User.create(params);
  }

  getId(): UserId {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): Email {
    return this.email;
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }
}
