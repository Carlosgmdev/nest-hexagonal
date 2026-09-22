import DomainValidationError from './domain-validation.error.js';

export default class InvalidEmailError extends DomainValidationError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidEmailError';
  }
}
