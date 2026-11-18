'use client';

import { Skeleton } from '@devlab/ui';
import { useAdminProjects } from '@/hooks/use-admin-api';

export default function AdminProjectsPage() {
  const projectsQuery = useAdminProjects();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Projects</h1>
        <p className="text-sm text-muted-foreground">All projects in the local database.</p>
      </div>
      {projectsQuery.isLoading ? (
        <Skeleton className="h-48 rounded-xl" />
      ) : (
        <div className="space-y-3">
          {(projectsQuery.data ?? []).map((project) => (
            <div key={project.id} className="rounded-xl border bg-card/80 p-4">
              <h2 className="font-semibold">{project.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {project.description || 'No description'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
