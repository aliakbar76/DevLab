'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProjectSchema, type CreateProjectInput } from '@devlab/contracts';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Skeleton,
  Textarea,
} from '@devlab/ui';
import { Plus } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { useCreateProject, useProjects } from '@/hooks/use-api';

export default function ProjectsPage() {
  const projectsQuery = useProjects();
  const createProject = useCreateProject();
  const [open, setOpen] = React.useState(false);
  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: '', description: '' },
  });

  async function onSubmit(values: CreateProjectInput) {
    await createProject.mutateAsync(values);
    form.reset();
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="animate-rise space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Membership-scoped projects for the selected demo user.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              New project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create project</DialogTitle>
              <DialogDescription>
                You will automatically become a member of the new project.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...form.register('name')} />
                {form.formState.errors.name ? (
                  <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...form.register('description')} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createProject.isPending}>
                  {createProject.isPending ? 'Creating…' : 'Create project'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {projectsQuery.isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      ) : (projectsQuery.data ?? []).length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create a project to start organizing tasks for this demo user."
          actionLabel="New project"
          onAction={() => setOpen(true)}
        />
      ) : (
        <div className="grid gap-3">
          {(projectsQuery.data ?? []).map((project, index) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="animate-rise block rounded-xl border bg-card/80 p-5 transition-colors hover:border-primary/40 hover:bg-accent/30"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <h2 className="text-lg font-semibold tracking-tight">{project.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {project.description || 'No description'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
