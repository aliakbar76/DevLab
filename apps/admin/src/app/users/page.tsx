'use client';

import { Skeleton } from '@devlab/ui';
import { useAdminUsers } from '@/hooks/use-admin-api';

export default function AdminUsersPage() {
  const usersQuery = useAdminUsers();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">Seeded demo users available to the laboratory.</p>
      </div>
      {usersQuery.isLoading ? (
        <Skeleton className="h-48 rounded-xl" />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card/80">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 font-mono text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
              </tr>
            </thead>
            <tbody>
              {(usersQuery.data ?? []).map((user) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
