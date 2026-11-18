'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProjectSchema, type UpdateProjectInput } from '@devlab/contracts';
import {
  Button,
  Input,
  Label,
  Skeleton,
  Textarea,
} from '@devlab/ui';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useDeleteProject, useProject, useUpdateProject } from '@/hooks/use-api';

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const projectId = params.id;
  const projectQuery = useProject(projectId);
  const updateProject = useUpdateProject(projectId);
  const deleteProject = useDeleteProject();

  const form = useForm<UpdateProjectInput>({
    resolver: zodResolver(updateProjectSchema),
    values: {
      name: projectQuery.data?.name ?? '',
      description: projectQuery.data?.description ?? '',
    },
  });

  async function onSubmit(values: UpdateProjectInput) {
    await updateProject.mutateAsync(values);
  }

  async function onDelete() {
    if (!window.confirm('Delete this project and all of its tasks?')) {
      return;
    }
    await deleteProject.mutateAsync(projectId);
    router.push('/projects');
  }

  if (projectQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  if (projectQuery.isError || !projectQuery.data) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">Project not found for this demo user.</p>
        <Button asChild variant="outline">
          <Link href="/projects">Back to projects</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/projects">
            <ArrowLeft />
            Projects
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/projects/${projectId}/tasks`}>Open tasks</Link>
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={deleteProject.isPending}>
            <Trash2 />
            Delete
          </Button>
        </div>
      </div>

      <section className="animate-rise space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{projectQuery.data.name}</h1>
        <p className="text-sm text-muted-foreground">Edit project details or manage its tasks.</p>
      </section>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-xl space-y-4 rounded-2xl border bg-card/80 p-5"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...form.register('name')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...form.register('description')} />
        </div>
        <Button type="submit" disabled={updateProject.isPending}>
          {updateProject.isPending ? 'Saving…' : 'Save changes'}
        </Button>
      </form>
    </div>
  );
}
