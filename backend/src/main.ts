import { NestFactory } from '@nestjs/core';
import { configureApp } from './app-config.js';
import { AppModule } from './app.module.js';
import { AuthConfig } from './auth/auth.config.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  const config = app.get(AuthConfig);
  await app.listen(process.env.PORT ?? 3000, config.local ? '127.0.0.1' : '0.0.0.0');
}
await bootstrap();
