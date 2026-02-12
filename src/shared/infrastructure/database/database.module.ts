import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { postgresProvider } from './postgres.provider';
import databaseConfig from '../config/database.config';

@Global()
@Module({
  imports: [ConfigModule.forFeature(databaseConfig)],
  providers: [postgresProvider],
  exports: [postgresProvider],
})
export class DatabaseModule {}
