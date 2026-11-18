'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createTaskSchema,
  type CreateTaskInput,
  type Task,
  type TaskStatus,
  type UpdateTaskInput,
} from '@devlab/contracts';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Textarea,
} from '@devlab/ui';
import { ArrowLeft, Plus } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { StatusBadge } from '@/components/status-badge';
import {
  useCreateTask,
  useDeleteTask,
  useProject,
  useProjectMembers,
  useProjectTasks,
  useUpdateTask,
} from '@/hooks/use-api';

const STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

function TaskRow({
  task,
  members,
  onUpdate,
  onDelete,
  pending,
}: {
  task: Task;
  members: { id: string; name: string }[];
  onUpdate: (taskId: string, input: UpdateTaskInput) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  pending: boolean;
}) {
  const assigneeName = members.find((member) => member.id === task.assigneeId)?.name ?? 'Unassigned';

  return (
    <div className="animate-rise rounded-xl border bg-card/80 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold tracking-tight">{task.title}</h3>
            <StatusBadge status={task.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {task.description || 'No description'}
          </p>
          <p className="mt-2 font-mono text-xs text-muted-foreground">Assignee: {assigneeName}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={task.status}
            onValueChange={(status) => onUpdate(task.id, { status: status as TaskStatus })}
            disabled={pending}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={task.assigneeId ?? 'unassigned'}
            onValueChange={(value) =>
              onUpdate(task.id, { assigneeId: value === 'unassigned' ? null : value })
            }
            disabled={pending}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {members.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() => onDelete(task.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectTasksPage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const projectQuery = useProject(projectId);
  const tasksQuery = useProjectTasks(projectId);
  const membersQuery = useProjectMembers(projectId);
  const createTask = useCreateTask(projectId);
  const updateTask = useUpdateTask(projectId);
  const deleteTask = useDeleteTask(projectId);
  const [open, setOpen] = React.useState(false);

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
      assigneeId: null,
    },
  });

  async function onCreate(values: CreateTaskInput) {
    await createTask.mutateAsync(values);
    form.reset({ title: '', description: '', status: 'TODO', assigneeId: null });
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/projects/${projectId}`}>
            <ArrowLeft />
            Project
          </Link>
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              New task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create task</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={form.handleSubmit(onCreate)}>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...form.register('title')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...form.register('description')} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.watch('status') ?? 'TODO'}
                  onValueChange={(value) => form.setValue('status', value as TaskStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select
                  value={form.watch('assigneeId') ?? 'unassigned'}
                  onValueChange={(value) =>
                    form.setValue('assigneeId', value === 'unassigned' ? null : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {(membersQuery.data ?? []).map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createTask.isPending}>
                  {createTask.isPending ? 'Creating…' : 'Create task'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <section className="animate-rise space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {projectQuery.data?.name ?? 'Tasks'}
        </h1>
        <p className="text-sm text-muted-foreground">Manage work items for this project.</p>
      </section>

      {tasksQuery.isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      ) : (tasksQuery.data ?? []).length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Create the first task for this project board."
          actionLabel="New task"
          onAction={() => setOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {STATUSES.map((status) => {
            const columnTasks = (tasksQuery.data ?? []).filter((task) => task.status === status);
            if (columnTasks.length === 0) {
              return null;
            }
            return (
              <div key={status} className="space-y-2">
                <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {status.replace('_', ' ')} · {columnTasks.length}
                </h2>
                {columnTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    members={membersQuery.data ?? []}
                    pending={updateTask.isPending || deleteTask.isPending}
                    onUpdate={async (taskId, input) => {
                      await updateTask.mutateAsync({ taskId, input });
                    }}
                    onDelete={async (taskId) => {
                      if (!window.confirm('Delete this task?')) {
                        return;
                      }
                      await deleteTask.mutateAsync(taskId);
                    }}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
