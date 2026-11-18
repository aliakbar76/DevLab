'use client';

import { Skeleton } from '@devlab/ui';
import { useAdminStats } from '@/hooks/use-admin-api';

export default function AdminDashboardPage() {
  const statsQuery = useAdminStats();
  const stats = statsQuery.data;

  return (
    <div className="space-y-8">
      <section className="animate-rise space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Local only</p>
        <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Development overview of seeded and live DevLab data. This app is not production admin
          authorization.
        </p>
      </section>

      {statsQuery.isLoading || !stats ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['Users', stats.totals.users],
              ['Projects', stats.totals.projects],
              ['Tasks', stats.totals.tasks],
            ].map(([label, value], index) => (
              <div
                key={label}
                className="animate-rise rounded-2xl border bg-card/80 p-5"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {label}
                </p>
                <p className="mt-3 text-3xl font-extrabold tracking-tight">{value}</p>
              </div>
            ))}
          </div>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border bg-card/80 p-5">
              <h2 className="text-lg font-semibold">Tasks by status</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {Object.entries(stats.tasksByStatus).map(([status, count]) => (
                  <li key={status} className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                      {status.replace('_', ' ')}
                    </span>
                    <span className="font-semibold">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border bg-card/80 p-5">
              <h2 className="text-lg font-semibold">Recent projects</h2>
              <ul className="mt-4 space-y-3">
                {stats.recentProjects.map((project) => (
                  <li key={project.id}>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {project.description || 'No description'}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="rounded-2xl border bg-card/80 p-5">
            <h2 className="text-lg font-semibold">Recent tasks</h2>
            <ul className="mt-4 divide-y">
              {stats.recentTasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <span className="font-medium">{task.title}</span>
                  <span className="font-mono text-xs text-muted-foreground">{task.status}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
