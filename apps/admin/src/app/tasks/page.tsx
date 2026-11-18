'use client';

import { Skeleton } from '@devlab/ui';
import { useAdminTasks } from '@/hooks/use-admin-api';

export default function AdminTasksPage() {
  const tasksQuery = useAdminTasks();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Tasks</h1>
        <p className="text-sm text-muted-foreground">Cross-project task overview.</p>
      </div>
      {tasksQuery.isLoading ? (
        <Skeleton className="h-48 rounded-xl" />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card/80">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 font-mono text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Project</th>
              </tr>
            </thead>
            <tbody>
              {(tasksQuery.data ?? []).map((task) => (
                <tr key={task.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{task.title}</td>
                  <td className="px-4 py-3 font-mono text-xs">{task.status}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {task.projectId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
