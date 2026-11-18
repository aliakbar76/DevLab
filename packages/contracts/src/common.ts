import { z } from 'zod';

export const idSchema = z.string().cuid();

export const isoDateSchema = z.string().datetime({ offset: true }).or(z.date());

export const paginationQuerySchema = z.object({
  take: z.coerce.number().int().min(1).max(100).optional().default(50),
  skip: z.coerce.number().int().min(0).optional().default(0),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
