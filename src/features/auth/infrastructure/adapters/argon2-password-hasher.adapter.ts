import * as argon2 from 'argon2';
import type PasswordHasher from '../../application/ports/password-hasher.port.js';

const DUMMY_PASSWORD_HASH =
  '$argon2id$v=19$m=19456,p=1,t=2$zRG2Irasu1r9KBId2uQKlA$zmpaTum7GwnSBFtj8LYMZhguI8ricO1cHDO+f8RXb6k';

export default class Argon2PasswordHasher implements PasswordHasher {
  hash(plainText: string): Promise<string> {
    return argon2.hash(plainText, {
      type: argon2.argon2id,
      memoryCost: 19_456,
      timeCost: 2,
      parallelism: 1,
    });
  }

  compare(plainText: string, hash: string | null): Promise<boolean> {
    return argon2.verify(hash ?? DUMMY_PASSWORD_HASH, plainText);
  }
}
