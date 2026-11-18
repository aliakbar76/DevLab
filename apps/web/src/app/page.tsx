'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, CircleDashed, LoaderCircle } from 'lucide-react';
import { Skeleton } from '@devlab/ui';
import { useProjectTasks, useProjects } from '@/hooks/use-api';
import { useDemoUser } from '@/lib/demo-user';

function OverviewStats() {
  const projectsQuery = useProjects();
  const projects = projectsQuery.data ?? [];
  const firstProjectId = projects[0]?.id;
  const tasksQuery = useProjectTasks(firstProjectId ?? '');

  const totalProjects = projects.length;
  const sampleTasks = tasksQuery.data ?? [];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="animate-rise rounded-2xl border bg-card/80 p-5 shadow-sm">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Projects
        </p>
        <p className="mt-3 text-3xl font-extrabold tracking-tight">{totalProjects}</p>
      </div>
      <div className="animate-rise rounded-2xl border bg-card/80 p-5 shadow-sm [animation-delay:60ms]">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Sample board
        </p>
        <p className="mt-3 text-3xl font-extrabold tracking-tight">
          {firstProjectId ? sampleTasks.length : '—'}
        </p>
      </div>
      <div className="animate-rise rounded-2xl border bg-card/80 p-5 shadow-sm [animation-delay:120ms]">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Identity
        </p>
        <p className="mt-3 text-lg font-semibold tracking-tight">Demo fixture</p>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const { demoUserId, users, ready } = useDemoUser();
  const projectsQuery = useProjects();
  const currentUser = users.find((user) => user.id === demoUserId);

  return (
    <div className="space-y-8">
      <section className="animate-rise space-y-3">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Workspace</p>
        <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          DevLab
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          A minimal project management laboratory for teaching real software engineering—
          intentionally incomplete, intentionally extensible.
        </p>
        {ready && currentUser ? (
          <p className="text-sm text-muted-foreground">
            Acting as <span className="font-semibold text-foreground">{currentUser.name}</span>
          </p>
        ) : null}
      </section>

      {!ready || projectsQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      ) : (
        <OverviewStats />
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold tracking-tight">Your projects</h2>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {projectsQuery.isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        ) : (projectsQuery.data ?? []).length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card/50 p-8 text-sm text-muted-foreground">
            No projects for this demo user yet. Create one from the Projects page.
          </div>
        ) : (
          <div className="grid gap-3">
            {(projectsQuery.data ?? []).slice(0, 4).map((project, index) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}/tasks`}
                className="animate-rise group flex items-center justify-between rounded-xl border bg-card/80 px-5 py-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div>
                  <h3 className="font-semibold tracking-tight group-hover:text-primary">
                    {project.name}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                    {project.description || 'No description'}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-3 rounded-2xl border bg-card/70 p-5 sm:grid-cols-3">
        <div className="flex items-start gap-3">
          <CircleDashed className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold">Membership scoped</p>
            <p className="text-xs text-muted-foreground">Projects and tasks respect membership.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <LoaderCircle className="mt-0.5 h-4 w-4 text-primary" />
          <div>
            <p className="text-sm font-semibold">Demo identity only</p>
            <p className="text-xs text-muted-foreground">Real auth stays for a future episode.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
          <div>
            <p className="text-sm font-semibold">Baseline ready</p>
            <p className="text-xs text-muted-foreground">Clean foundation for YouTube labs.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
