import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1),
  email: z.string().email(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type User = z.infer<typeof userSchema>;

export const userListSchema = z.array(userSchema);
