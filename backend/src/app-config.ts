import { ValidationPipe, type INestApplication } from '@nestjs/common';
import type { Application } from 'express';
import { AuthConfig } from './auth/auth.config.js';

export function configureApp(app: INestApplication) {
  const config = app.get(AuthConfig);
  const express = app.getHttpAdapter().getInstance() as Application;
  express.set('trust proxy', config.trustedProxies.length ? config.trustedProxies : false);
  app.useGlobalPipes(validation());
}

function validation() {
  return new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    validationError: { target: false, value: false },
  });
}

export const loginValidation = validation();
