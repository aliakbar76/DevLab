import type { TaskStatus } from '@devlab/contracts';
import { Badge } from '@devlab/ui';

const LABELS: Record<TaskStatus, string> = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  DONE: 'Done',
};

const VARIANTS: Record<TaskStatus, 'muted' | 'warning' | 'success'> = {
  TODO: 'muted',
  IN_PROGRESS: 'warning',
  DONE: 'success',
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <Badge variant={VARIANTS[status]}>{LABELS[status]}</Badge>;
}
