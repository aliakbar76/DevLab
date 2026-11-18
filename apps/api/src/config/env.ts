import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().positive().default(4400),
  DATABASE_URL: z.string().min(1),
  IDENTITY_MODE: z.enum(['demo']).default('demo'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function loadEnvConfig(env: NodeJS.ProcessEnv = process.env): EnvConfig {
  const parsed = envSchema.safeParse(env);

  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
    throw new Error(`Invalid environment configuration:\n${details.join('\n')}`);
  }

  const config = parsed.data;

  if (config.NODE_ENV === 'production' && config.IDENTITY_MODE === 'demo') {
    throw new Error(
      'Refusing to start: IDENTITY_MODE=demo is a local development fixture and cannot run in production. Replace the demo identity adapter with a real authentication module in a future episode.',
    );
  }

  return config;
}
