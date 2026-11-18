import { z } from 'zod';
import { projectSchema } from './project.js';
import { taskSchema, taskStatusSchema } from './task.js';

export const adminStatsSchema = z.object({
  totals: z.object({
    users: z.number().int().nonnegative(),
    projects: z.number().int().nonnegative(),
    tasks: z.number().int().nonnegative(),
  }),
  tasksByStatus: z.record(taskStatusSchema, z.number().int().nonnegative()),
  recentProjects: z.array(projectSchema),
  recentTasks: z.array(taskSchema),
});

export type AdminStats = z.infer<typeof adminStatsSchema>;
