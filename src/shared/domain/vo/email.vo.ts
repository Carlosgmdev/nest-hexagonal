import InvalidEmailError from '../errors/invalid-email.error.js';

export default class Email {
  private constructor(private readonly value: string) {}

  static create(rawValue: string): Email {
    const value = rawValue.trim().toLowerCase();

    if (!value) throw new InvalidEmailError('El correo es obligatorio.');

    if (value.length > 254)
      throw new InvalidEmailError('El correo es demasiado largo.');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(value))
      throw new InvalidEmailError('El formato del correo no es válido.');

    return new Email(value);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
