import { PrismaClient, TaskStatus } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Deterministic, idempotent seed for local development.
 * Fixed IDs keep demo identity switching stable across re-seeds.
 */
const USERS = [
  {
    id: 'clseeduser000000000000001',
    name: 'Ava Chen',
    email: 'ava.chen@devlab.local',
  },
  {
    id: 'clseeduser000000000000002',
    name: 'Marcus Reed',
    email: 'marcus.reed@devlab.local',
  },
  {
    id: 'clseeduser000000000000003',
    name: 'Sofia Alvarez',
    email: 'sofia.alvarez@devlab.local',
  },
  {
    id: 'clseeduser000000000000004',
    name: 'Noah Patel',
    email: 'noah.patel@devlab.local',
  },
  {
    id: 'clseeduser000000000000005',
    name: 'Elena Brooks',
    email: 'elena.brooks@devlab.local',
  },
] as const;

const PROJECTS = [
  {
    id: 'clseedproj000000000000001',
    name: 'Platform Foundations',
    description: 'Baseline infrastructure and shared engineering practices for DevLab.',
  },
  {
    id: 'clseedproj000000000000002',
    name: 'Collaboration Workspace',
    description: 'Project boards, task flows, and teammate visibility.',
  },
  {
    id: 'clseedproj000000000000003',
    name: 'Developer Experience',
    description: 'Local tooling, documentation, and onboarding polish.',
  },
] as const;

const MEMBERSHIPS: Array<{ id: string; userId: string; projectId: string }> = [
  {
    id: 'clseedmemb000000000000001',
    userId: USERS[0].id,
    projectId: PROJECTS[0].id,
  },
  {
    id: 'clseedmemb000000000000002',
    userId: USERS[1].id,
    projectId: PROJECTS[0].id,
  },
  {
    id: 'clseedmemb000000000000003',
    userId: USERS[2].id,
    projectId: PROJECTS[0].id,
  },
  {
    id: 'clseedmemb000000000000004',
    userId: USERS[0].id,
    projectId: PROJECTS[1].id,
  },
  {
    id: 'clseedmemb000000000000005',
    userId: USERS[2].id,
    projectId: PROJECTS[1].id,
  },
  {
    id: 'clseedmemb000000000000006',
    userId: USERS[3].id,
    projectId: PROJECTS[1].id,
  },
  {
    id: 'clseedmemb000000000000007',
    userId: USERS[1].id,
    projectId: PROJECTS[2].id,
  },
  {
    id: 'clseedmemb000000000000008',
    userId: USERS[3].id,
    projectId: PROJECTS[2].id,
  },
  {
    id: 'clseedmemb000000000000009',
    userId: USERS[4].id,
    projectId: PROJECTS[2].id,
  },
];

const TASKS: Array<{
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: string | null;
}> = [
  {
    id: 'clseedtask000000000000001',
    projectId: PROJECTS[0].id,
    title: 'Define workspace layout',
    description: 'Confirm monorepo package boundaries and app ports.',
    status: TaskStatus.DONE,
    assigneeId: USERS[0].id,
  },
  {
    id: 'clseedtask000000000000002',
    projectId: PROJECTS[0].id,
    title: 'Wire PostgreSQL locally',
    description: 'Docker Compose service with reproducible credentials.',
    status: TaskStatus.DONE,
    assigneeId: USERS[1].id,
  },
  {
    id: 'clseedtask000000000000003',
    projectId: PROJECTS[0].id,
    title: 'Document baseline scope',
    description: 'Capture intentional omissions for future episodes.',
    status: TaskStatus.IN_PROGRESS,
    assigneeId: USERS[2].id,
  },
  {
    id: 'clseedtask000000000000004',
    projectId: PROJECTS[0].id,
    title: 'Add health endpoint',
    description: 'Simple readiness check for local smoke tests.',
    status: TaskStatus.TODO,
    assigneeId: USERS[0].id,
  },
  {
    id: 'clseedtask000000000000005',
    projectId: PROJECTS[0].id,
    title: 'Review Prisma relations',
    description: 'Validate FK cascade behavior for projects and tasks.',
    status: TaskStatus.TODO,
    assigneeId: null,
  },
  {
    id: 'clseedtask000000000000006',
    projectId: PROJECTS[1].id,
    title: 'Project list view',
    description: 'Membership-scoped project listing for the web app.',
    status: TaskStatus.DONE,
    assigneeId: USERS[0].id,
  },
  {
    id: 'clseedtask000000000000007',
    projectId: PROJECTS[1].id,
    title: 'Task board statuses',
    description: 'Support TODO, IN_PROGRESS, and DONE transitions.',
    status: TaskStatus.IN_PROGRESS,
    assigneeId: USERS[2].id,
  },
  {
    id: 'clseedtask000000000000008',
    projectId: PROJECTS[1].id,
    title: 'Assignee picker',
    description: 'Limit assignees to project members only.',
    status: TaskStatus.IN_PROGRESS,
    assigneeId: USERS[3].id,
  },
  {
    id: 'clseedtask000000000000009',
    projectId: PROJECTS[1].id,
    title: 'Empty state polish',
    description: 'Clear CTAs when a project has no tasks yet.',
    status: TaskStatus.TODO,
    assigneeId: USERS[2].id,
  },
  {
    id: 'clseedtask000000000000010',
    projectId: PROJECTS[1].id,
    title: 'Delete confirmation',
    description: 'Confirm before destructive project deletion.',
    status: TaskStatus.TODO,
    assigneeId: null,
  },
  {
    id: 'clseedtask000000000000011',
    projectId: PROJECTS[1].id,
    title: 'Demo user switcher',
    description: 'Local-only identity fixture for educational flows.',
    status: TaskStatus.DONE,
    assigneeId: USERS[0].id,
  },
  {
    id: 'clseedtask000000000000012',
    projectId: PROJECTS[2].id,
    title: 'Seed script idempotency',
    description: 'Re-running seed must not invent new demo records.',
    status: TaskStatus.DONE,
    assigneeId: USERS[1].id,
  },
  {
    id: 'clseedtask000000000000013',
    projectId: PROJECTS[2].id,
    title: 'Shared UI package',
    description: 'Extract reusable primitives for web and admin.',
    status: TaskStatus.IN_PROGRESS,
    assigneeId: USERS[4].id,
  },
  {
    id: 'clseedtask000000000000014',
    projectId: PROJECTS[2].id,
    title: 'Admin stats endpoint',
    description: 'Single aggregate endpoint for the local dashboard.',
    status: TaskStatus.TODO,
    assigneeId: USERS[3].id,
  },
  {
    id: 'clseedtask000000000000015',
    projectId: PROJECTS[2].id,
    title: 'Episode branch docs',
    description: 'Explain how educational branches stay isolated.',
    status: TaskStatus.TODO,
    assigneeId: USERS[4].id,
  },
  {
    id: 'clseedtask000000000000016',
    projectId: PROJECTS[2].id,
    title: 'Lint and format configs',
    description: 'Shared ESLint and Prettier across the monorepo.',
    status: TaskStatus.DONE,
    assigneeId: USERS[1].id,
  },
  {
    id: 'clseedtask000000000000017',
    projectId: PROJECTS[0].id,
    title: 'OpenAPI documentation',
    description: 'Expose Swagger UI for the baseline REST API.',
    status: TaskStatus.IN_PROGRESS,
    assigneeId: USERS[1].id,
  },
  {
    id: 'clseedtask000000000000018',
    projectId: PROJECTS[1].id,
    title: 'Theme preferences',
    description: 'Light and dark mode toggle in settings.',
    status: TaskStatus.TODO,
    assigneeId: USERS[3].id,
  },
];

async function main() {
  for (const user of USERS) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: { name: user.name, email: user.email },
      create: user,
    });
  }

  for (const project of PROJECTS) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: { name: project.name, description: project.description },
      create: project,
    });
  }

  for (const membership of MEMBERSHIPS) {
    await prisma.projectMembership.upsert({
      where: { id: membership.id },
      update: { userId: membership.userId, projectId: membership.projectId },
      create: membership,
    });
  }

  for (const task of TASKS) {
    await prisma.task.upsert({
      where: { id: task.id },
      update: {
        projectId: task.projectId,
        title: task.title,
        description: task.description,
        status: task.status,
        assigneeId: task.assigneeId,
      },
      create: task,
    });
  }

  // eslint-disable-next-line no-console
  console.log(
    `Seeded ${USERS.length} users, ${PROJECTS.length} projects, ${MEMBERSHIPS.length} memberships, ${TASKS.length} tasks.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
