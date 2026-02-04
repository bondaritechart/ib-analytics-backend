import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Suppress Express app.router deprecation warning
// This is needed because NestJS ExpressAdapter checks for app.router
// which triggers a deprecation warning in Express 5.x
const originalEmitWarning = process.emitWarning;
process.emitWarning = function (warning, ...args) {
  if (
    typeof warning === 'string' &&
    warning.includes("'app.router' is deprecated")
  ) {
    return false;
  }
  if (
    typeof warning === 'object' &&
    warning?.message?.includes("'app.router' is deprecated")
  ) {
    return false;
  }
  return originalEmitWarning.call(process, warning, ...args);
};

let cachedApp: express.Application;

async function createApp(): Promise<express.Application> {
  if (cachedApp) {
    return cachedApp;
  }

  const expressApp = express();

  // Patch app.get to handle router check without triggering deprecation
  // NestJS ExpressAdapter calls app.get('router') which throws in Express 5.x
  const originalGet = expressApp.get.bind(expressApp);
  expressApp.get = ((...args: unknown[]) => {
    if (args.length === 1 && args[0] === 'router') {
      return (expressApp as { _router?: unknown })._router;
    }
    try {
      return (originalGet as (...innerArgs: unknown[]) => unknown)(...args);
    } catch (error) {
      // If it's the router deprecation error, return undefined
      if (
        error instanceof Error &&
        error.message?.includes("'app.router' is deprecated")
      ) {
        return undefined;
      }
      throw error;
    }
  }) as typeof expressApp.get;

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.init();
  cachedApp = expressApp;

  return expressApp;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  const app = await createApp();
  app(req, res);
}
