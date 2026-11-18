import { config as loadDotenv } from 'dotenv';
import { resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { loadEnvConfig } from './config/env';

loadDotenv({ path: resolve(process.cwd(), '.env') });
loadDotenv({ path: resolve(process.cwd(), '../../.env') });

async function bootstrap() {
  const env = loadEnvConfig();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  app.enableCors({
    origin: true,
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-demo-user-id'],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('DevLab API')
    .setDescription(
      'Baseline REST API for the DevLab educational laboratory. Demo identity is a local fixture, not production authentication.',
    )
    .setVersion('0.1.0')
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'x-demo-user-id',
        description: 'Development-only demo user id (not real auth)',
      },
      'demo-user',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(env.API_PORT, '0.0.0.0');
}

void bootstrap();
