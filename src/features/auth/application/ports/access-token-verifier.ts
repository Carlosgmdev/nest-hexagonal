import type { AccessTokenClaims } from './access-token-issuer.js';

export default interface AccessTokenVerifier {
  verify(token: string): Promise<AccessTokenClaims>;
}
