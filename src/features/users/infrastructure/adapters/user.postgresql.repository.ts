import User from "@features/users/domain/entities/user.entity";
import UserRepository from "@features/users/domain/repositories/user.repository";
import { Injectable, Inject, InternalServerErrorException } from "@nestjs/common";
import type { Row, RowList, Sql } from 'postgres';
import { POSTGRES_CONNECTION } from '@shared/infrastructure/database/postgres.provider';

@Injectable()
export default class UserPostgreSQLRepository implements UserRepository {
  constructor(
    @Inject(POSTGRES_CONNECTION) private readonly sql: Sql,
  ) {}

  async getByUsername(username: string): Promise<User | null> {
    try {
      const result: RowList<Row[]> = await this.sql`
        SELECT
          id,
          name,
          last_name AS "lastName",
          username,
          password_hash AS "passwordHash"
        FROM users
        WHERE username = ${username};
    `;

      if (!result.length) return null;
      const [userObj] = result;
      return new User(userObj)
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}