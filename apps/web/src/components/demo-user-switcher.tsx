'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@devlab/ui';
import { useUsers } from '@/hooks/use-api';
import { useDemoUser } from '@/lib/demo-user';

export function DemoUserSwitcher() {
  const { demoUserId, setDemoUserId, ready } = useDemoUser();
  const usersQuery = useUsers();

  if (!ready) {
    return <div className="h-10 w-44 animate-pulse rounded-lg bg-muted" />;
  }

  return (
    <Select value={demoUserId ?? undefined} onValueChange={setDemoUserId}>
      <SelectTrigger className="w-[11.5rem] sm:w-52" aria-label="Demo user">
        <SelectValue placeholder="Select demo user" />
      </SelectTrigger>
      <SelectContent>
        {(usersQuery.data ?? []).map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
