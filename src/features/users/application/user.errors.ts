export class UserEmailAlreadyExistsError extends Error {
  constructor() {
    super('Ya existe un usuario con ese correo.');
    this.name = 'UserEmailAlreadyExistsError';
  }
}
