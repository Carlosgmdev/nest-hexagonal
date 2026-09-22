import type { AuthenticatedUser } from './authenticated-user.js';

declare global {
  namespace Express {
    interface Request {
      authenticatedUser?: AuthenticatedUser;
    }
  }
}

export {};
