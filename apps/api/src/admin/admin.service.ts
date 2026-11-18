import { Injectable } from '@nestjs/common';
import type { AdminStats, TaskStatus } from '@devlab/contracts';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Local development dashboard aggregates.
 * Not privileged production administration.
 */
@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<AdminStats> {
    const [users, projects, tasks, grouped, recentProjects, recentTasks] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.project.count(),
      this.prisma.task.count(),
      this.prisma.task.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      this.prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.task.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
      }),
    ]);

    const tasksByStatus: Record<TaskStatus, number> = {
      TODO: 0,
      IN_PROGRESS: 0,
      DONE: 0,
    };

    for (const row of grouped) {
      tasksByStatus[row.status] = row._count._all;
    }

    return {
      totals: { users, projects, tasks },
      tasksByStatus,
      recentProjects,
      recentTasks,
    };
  }

  listAllProjects() {
    return this.prisma.project.findMany({ orderBy: { updatedAt: 'desc' } });
  }

  listAllTasks() {
    return this.prisma.task.findMany({ orderBy: { updatedAt: 'desc' } });
  }
}
