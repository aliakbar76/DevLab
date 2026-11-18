import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Minimal membership boundary checks.
 * Not RBAC — only "is this user a member of this project?"
 */
@Injectable()
export class MembershipService {
  constructor(private readonly prisma: PrismaService) {}

  async assertMember(userId: string, projectId: string): Promise<void> {
    const membership = await this.prisma.projectMembership.findUnique({
      where: {
        userId_projectId: { userId, projectId },
      },
      select: { id: true },
    });

    if (!membership) {
      // Hide existence from non-members.
      throw new NotFoundException('Project not found');
    }
  }

  async isMember(userId: string, projectId: string): Promise<boolean> {
    const membership = await this.prisma.projectMembership.findUnique({
      where: {
        userId_projectId: { userId, projectId },
      },
      select: { id: true },
    });
    return Boolean(membership);
  }

  async assertAssigneeIsMember(projectId: string, assigneeId: string | null | undefined) {
    if (!assigneeId) {
      return;
    }

    const membership = await this.prisma.projectMembership.findUnique({
      where: {
        userId_projectId: { userId: assigneeId, projectId },
      },
      select: { id: true },
    });

    if (!membership) {
      throw new NotFoundException('Assignee is not a member of this project');
    }
  }
}
