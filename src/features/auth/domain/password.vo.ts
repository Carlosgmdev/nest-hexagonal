import DomainValidationError from '../../../shared/domain/errors/domain-validation.error.js';

const MINIMUM_PASSWORD_LENGTH = 15;
const MAXIMUM_PASSWORD_LENGTH = 128;

export default class Password {
  private constructor(private readonly value: string) {}

  static create(value: string): Password {
    if (
      value.length < MINIMUM_PASSWORD_LENGTH ||
      value.length > MAXIMUM_PASSWORD_LENGTH
    ) {
      throw new DomainValidationError(
        `La contraseña debe contener entre ${MINIMUM_PASSWORD_LENGTH} y ${MAXIMUM_PASSWORD_LENGTH} caracteres.`,
      );
    }

    return new Password(value);
  }

  toString(): string {
    return this.value;
  }
}
