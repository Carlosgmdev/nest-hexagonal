import { JwtService } from '@nestjs/jwt';
import type AccessTokenIssuer from '../application/ports/access-token-issuer.js';
import type { AccessTokenClaims } from '../application/ports/access-token-issuer.js';
import type AccessTokenVerifier from '../application/ports/access-token-verifier.js';

export default class JwtAccessTokenService
  implements AccessTokenIssuer, AccessTokenVerifier
{
  constructor(private readonly jwtService: JwtService) {}

  issue(claims: AccessTokenClaims): Promise<string> {
    return this.jwtService.signAsync({
      sub: claims.subject,
    });
  }

  async verify(token: string): Promise<AccessTokenClaims> {
    const payload = await this.jwtService.verifyAsync<{ sub?: unknown }>(token);

    if (typeof payload.sub !== 'string') {
      throw new Error('El token no contiene un sujeto válido.');
    }

    return { subject: payload.sub };
  }
}
