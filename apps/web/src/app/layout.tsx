import type { Metadata } from 'next';
import { ThemeProvider } from '@devlab/ui';
import { AppShell } from '@/components/app-shell';
import { DemoUserProvider } from '@/lib/demo-user';
import { QueryProvider } from '@/lib/query-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'DevLab',
  description: 'Educational software engineering laboratory',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <DemoUserProvider>
              <AppShell>{children}</AppShell>
            </DemoUserProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
