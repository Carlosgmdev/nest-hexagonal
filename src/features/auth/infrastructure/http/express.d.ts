import type { AuthenticatedUser } from './authenticated-user.type.js';

declare global {
  namespace Express {
    interface Request {
      authenticatedUser?: AuthenticatedUser;
    }
  }
}

export {};
