import { z } from 'zod';

export const taskStatusSchema = z.enum(['TODO', 'IN_PROGRESS', 'DONE']);

export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional().nullable(),
  status: taskStatusSchema.optional(),
  assigneeId: z.string().cuid().optional().nullable(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(5000).optional().nullable(),
  status: taskStatusSchema.optional(),
  assigneeId: z.string().cuid().optional().nullable(),
});

export const taskSchema = z.object({
  id: z.string().cuid(),
  projectId: z.string().cuid(),
  title: z.string(),
  description: z.string().nullable(),
  status: taskStatusSchema,
  assigneeId: z.string().cuid().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type Task = z.infer<typeof taskSchema>;

export const taskListSchema = z.array(taskSchema);
