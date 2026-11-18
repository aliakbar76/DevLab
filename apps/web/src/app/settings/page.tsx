'use client';

import { useTheme } from 'next-themes';
import { Button, Separator } from '@devlab/ui';
import { DemoUserSwitcher } from '@/components/demo-user-switcher';
import { useDemoUser } from '@/lib/demo-user';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { demoUserId, users } = useDemoUser();
  const currentUser = users.find((user) => user.id === demoUserId);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <section className="animate-rise space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Local preferences for the DevLab baseline. Demo identity is not authentication.
        </p>
      </section>

      <section className="space-y-4 rounded-2xl border bg-card/80 p-5">
        <div>
          <h2 className="text-lg font-semibold">Demo user</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Switch the local fixture identity used for API requests via{' '}
            <code className="font-mono text-xs">x-demo-user-id</code>.
          </p>
        </div>
        <DemoUserSwitcher />
        {currentUser ? (
          <p className="text-sm text-muted-foreground">
            Current: <span className="font-medium text-foreground">{currentUser.name}</span> (
            {currentUser.email})
          </p>
        ) : null}
      </section>

      <Separator />

      <section className="space-y-4 rounded-2xl border bg-card/80 p-5">
        <div>
          <h2 className="text-lg font-semibold">Appearance</h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose light, dark, or system theme.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['light', 'dark', 'system'] as const).map((value) => (
            <Button
              key={value}
              variant={theme === value ? 'default' : 'outline'}
              onClick={() => setTheme(value)}
            >
              {value}
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}
