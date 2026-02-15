export default class User {
  id: string;
  name: string;
  lastName: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(userProps: Partial<User>) {
    this.id = userProps.id || "";
    this.name = userProps.name || "";
    this.lastName = userProps.lastName || "";
    this.username = userProps.username || "";
    this.passwordHash = userProps.passwordHash || "";

    this.createdAt = userProps.createdAt
      ? new Date(userProps.createdAt)
      : new Date();
      
    this.updatedAt = userProps.updatedAt
      ? new Date(userProps.updatedAt)
      : new Date();
  }
}
