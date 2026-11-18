import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateTaskInput, UpdateTaskInput } from '@devlab/contracts';
import { MembershipService } from '../membership/membership.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly memberships: MembershipService,
  ) {}

  async listForProject(userId: string, projectId: string) {
    await this.memberships.assertMember(userId, projectId);
    return this.prisma.task.findMany({
      where: { projectId },
      orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
    });
  }

  async getByIdForUser(userId: string, taskId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    await this.memberships.assertMember(userId, task.projectId);
    return task;
  }

  async create(userId: string, projectId: string, input: CreateTaskInput) {
    await this.memberships.assertMember(userId, projectId);
    await this.memberships.assertAssigneeIsMember(projectId, input.assigneeId);

    return this.prisma.task.create({
      data: {
        projectId,
        title: input.title,
        description: input.description ?? null,
        status: input.status ?? 'TODO',
        assigneeId: input.assigneeId ?? null,
      },
    });
  }

  async update(userId: string, taskId: string, input: UpdateTaskInput) {
    const existing = await this.getByIdForUser(userId, taskId);
    await this.memberships.assertAssigneeIsMember(existing.projectId, input.assigneeId);

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.assigneeId !== undefined ? { assigneeId: input.assigneeId } : {}),
      },
    });
  }

  async remove(userId: string, taskId: string) {
    await this.getByIdForUser(userId, taskId);
    await this.prisma.task.delete({ where: { id: taskId } });
    return { id: taskId, deleted: true as const };
  }
}
