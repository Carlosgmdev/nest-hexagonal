const MINIMUM_JWT_SECRET_LENGTH = 32;

export function validateEnvironment(
  environment: Record<string, unknown>,
): Record<string, unknown> {
  const nodeEnvironment = environment.NODE_ENV;
  const jwtSecret = environment.JWT_SECRET;

  if (nodeEnvironment === 'production' && typeof jwtSecret !== 'string') {
    throw new Error('JWT_SECRET es obligatorio en producción.');
  }

  if (
    typeof jwtSecret === 'string' &&
    jwtSecret.length < MINIMUM_JWT_SECRET_LENGTH
  ) {
    throw new Error(
      `JWT_SECRET debe contener al menos ${MINIMUM_JWT_SECRET_LENGTH} caracteres.`,
    );
  }

  return environment;
}
