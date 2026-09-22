export default interface PasswordHasher {
  hash(plainText: string): Promise<string>;
  compare(plainText: string, hash: string | null): Promise<boolean>;
}
