import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateProjectInput, UpdateProjectInput } from '@devlab/contracts';
import { MembershipService } from '../membership/membership.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly memberships: MembershipService,
  ) {}

  listForUser(userId: string) {
    return this.prisma.project.findMany({
      where: {
        memberships: {
          some: { userId },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getByIdForUser(userId: string, projectId: string) {
    await this.memberships.assertMember(userId, projectId);
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async create(userId: string, input: CreateProjectInput) {
    return this.prisma.project.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        memberships: {
          create: { userId },
        },
      },
    });
  }

  async update(userId: string, projectId: string, input: UpdateProjectInput) {
    await this.memberships.assertMember(userId, projectId);
    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
      },
    });
  }

  async remove(userId: string, projectId: string) {
    await this.memberships.assertMember(userId, projectId);
    await this.prisma.project.delete({ where: { id: projectId } });
    return { id: projectId, deleted: true as const };
  }

  listMembers(userId: string, projectId: string) {
    return this.getMembersAfterAssert(userId, projectId);
  }

  private async getMembersAfterAssert(userId: string, projectId: string) {
    await this.memberships.assertMember(userId, projectId);
    const memberships = await this.prisma.projectMembership.findMany({
      where: { projectId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
    return memberships.map((membership) => membership.user);
  }
}
