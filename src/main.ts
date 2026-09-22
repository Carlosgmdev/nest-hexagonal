import { NestFactory } from '@nestjs/core';
import { AppModule } from './shared/infrastructure/app.module.js';
import { configureApp } from './shared/infrastructure/configure-app.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
