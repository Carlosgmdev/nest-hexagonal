import { validateEnvironment } from './environment.js';

describe('validateEnvironment', () => {
  it('requires a JWT secret in production', () => {
    expect(() => validateEnvironment({ NODE_ENV: 'production' })).toThrow(
      'JWT_SECRET es obligatorio en producción.',
    );
  });

  it('rejects short JWT secrets', () => {
    expect(() => validateEnvironment({ JWT_SECRET: 'too-short' })).toThrow(
      'JWT_SECRET debe contener al menos 32 caracteres.',
    );
  });
});
