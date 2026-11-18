import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Test } from '@nestjs/testing';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { PrismaClient } from '@devlab/database';
import { AppModule } from '../src/app.module';
import { loadEnvConfig } from '../src/config/env';

const DEMO_USER_ID = 'clseeduser000000000000001';

describe('API smoke tests', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const { config: loadDotenv } = await import('dotenv');
    const { resolve } = await import('node:path');
    loadDotenv({ path: resolve(process.cwd(), '../../.env') });
    loadDotenv({ path: resolve(process.cwd(), '.env') });

    process.env.NODE_ENV = 'test';
    process.env.IDENTITY_MODE = 'demo';
    process.env.DATABASE_URL =
      process.env.TEST_DATABASE_URL ??
      'postgresql://devlab:devlab@localhost:5433/devlab_test?schema=public';
    process.env.API_PORT = '4010';

    loadEnvConfig(process.env);

    prisma = new PrismaClient({
      datasources: { db: { url: process.env.DATABASE_URL } },
    });
    await prisma.$connect();

    // Minimal deterministic fixtures for smoke tests.
    await prisma.task.deleteMany();
    await prisma.projectMembership.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();

    await prisma.user.create({
      data: {
        id: DEMO_USER_ID,
        name: 'Ava Chen',
        email: 'ava.chen@devlab.local',
      },
    });

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app?.close();
    await prisma?.$disconnect();
  });

  it('starts and connects to the database', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
  });

  it('creates a project, creates a task, and updates task status', async () => {
    const headers = { 'x-demo-user-id': DEMO_USER_ID };

    const projectResponse = await app.inject({
      method: 'POST',
      url: '/projects',
      headers,
      payload: {
        name: 'Smoke Project',
        description: 'Created by smoke test',
      },
    });
    expect(projectResponse.statusCode).toBe(201);
    const project = projectResponse.json() as { id: string; name: string };
    expect(project.name).toBe('Smoke Project');

    const taskResponse = await app.inject({
      method: 'POST',
      url: `/projects/${project.id}/tasks`,
      headers,
      payload: {
        title: 'Smoke Task',
        status: 'TODO',
      },
    });
    expect(taskResponse.statusCode).toBe(201);
    const task = taskResponse.json() as { id: string; status: string };
    expect(task.status).toBe('TODO');

    const updateResponse = await app.inject({
      method: 'PATCH',
      url: `/tasks/${task.id}`,
      headers,
      payload: { status: 'DONE' },
    });
    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.json()).toMatchObject({ id: task.id, status: 'DONE' });
  });
});
