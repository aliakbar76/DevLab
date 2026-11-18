import { Button } from '@devlab/ui';

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="animate-rise flex flex-col items-start gap-3 rounded-2xl border border-dashed border-border bg-card/60 px-6 py-10">
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <Button onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
