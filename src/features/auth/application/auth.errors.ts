export class InvalidCredentialsError extends Error {
  constructor() {
    super('Las credenciales no son válidas.');
    this.name = 'InvalidCredentialsError';
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super('El usuario no existe.');
    this.name = 'UserNotFoundError';
  }
}
