import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import postgres, { Sql } from 'postgres';

export const POSTGRES_CONNECTION = 'POSTGRES_CONNECTION';

export const postgresProvider: Provider = {
  provide: POSTGRES_CONNECTION,
  useFactory: (configService: ConfigService): Sql => {
    return postgres({
      host: configService.get<string>('database.host'),
      port: configService.get<number>('database.port'),
      database: configService.get<string>('database.database'),
      username: configService.get<string>('database.user'),
      password: configService.get<string>('database.password'),
    });
  },
  inject: [ConfigService],
};
