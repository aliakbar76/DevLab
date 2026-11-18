import { z } from 'zod';

/** Development-only demo identity header. Not production authentication. */
export const DEMO_USER_HEADER = 'x-demo-user-id' as const;

export const demoUserIdSchema = z.string().cuid();
