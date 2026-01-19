import { NestFactory } from '@nestjs/core';
import { AppModule } from './shared/infrastructure/modules/app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (): BadRequestException => new BadRequestException(),
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
