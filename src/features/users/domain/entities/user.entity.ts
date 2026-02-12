export default class User {
  id: number;
  name: string;
  lastName: string;
  username: string;
  passwordHash: string;

  constructor(userProps: Partial<User>) {
    Object.assign(this, userProps);
  }
}
