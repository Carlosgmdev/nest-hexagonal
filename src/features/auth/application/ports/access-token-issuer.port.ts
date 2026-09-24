export type AccessTokenClaims = {
  subject: string;
};

export default interface AccessTokenIssuer {
  issue(claims: AccessTokenClaims): Promise<string>;
}
