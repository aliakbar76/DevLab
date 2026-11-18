'use client';

import * as React from 'react';
import type { User } from '@devlab/contracts';

const STORAGE_KEY = 'devlab.demoUserId';

type DemoUserContextValue = {
  demoUserId: string | null;
  setDemoUserId: (id: string) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  ready: boolean;
};

const DemoUserContext = React.createContext<DemoUserContextValue | null>(null);

export function DemoUserProvider({ children }: { children: React.ReactNode }) {
  const [demoUserId, setDemoUserIdState] = React.useState<string | null>(null);
  const [users, setUsers] = React.useState<User[]>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setDemoUserIdState(stored);
    }
    setReady(true);
  }, []);

  const setDemoUserId = React.useCallback((id: string) => {
    window.localStorage.setItem(STORAGE_KEY, id);
    setDemoUserIdState(id);
  }, []);

  React.useEffect(() => {
    if (!ready || demoUserId || users.length === 0) {
      return;
    }
    setDemoUserId(users[0]!.id);
  }, [ready, demoUserId, users, setDemoUserId]);

  const value = React.useMemo(
    () => ({ demoUserId, setDemoUserId, users, setUsers, ready }),
    [demoUserId, setDemoUserId, users, ready],
  );

  return <DemoUserContext.Provider value={value}>{children}</DemoUserContext.Provider>;
}

export function useDemoUser() {
  const ctx = React.useContext(DemoUserContext);
  if (!ctx) {
    throw new Error('useDemoUser must be used within DemoUserProvider');
  }
  return ctx;
}
