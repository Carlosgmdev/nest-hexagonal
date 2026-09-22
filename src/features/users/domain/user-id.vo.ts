import DomainValidationError from '../../../shared/domain/errors/domain-validation.error.js';

export default class UserId {
  private constructor(private readonly value: string) {}

  static create(value: string): UserId {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        value,
      )
    ) {
      throw new DomainValidationError(
        'El identificador del usuario no es válido.',
      );
    }

    return new UserId(value);
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
