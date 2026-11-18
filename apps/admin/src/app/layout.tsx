import type { Metadata } from 'next';
import { AdminShell } from '@/components/admin-shell';
import { QueryProvider } from '@/lib/query-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'DevLab Admin',
  description: 'Local development dashboard for DevLab',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <AdminShell>{children}</AdminShell>
        </QueryProvider>
      </body>
    </html>
  );
}
