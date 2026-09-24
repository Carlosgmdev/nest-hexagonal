import type { AccessTokenClaims } from './access-token-issuer.port.js';

export default interface AccessTokenVerifier {
  verify(token: string): Promise<AccessTokenClaims>;
}
