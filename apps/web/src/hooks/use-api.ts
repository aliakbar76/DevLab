'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreateProjectInput,
  CreateTaskInput,
  Project,
  Task,
  UpdateProjectInput,
  UpdateTaskInput,
  User,
} from '@devlab/contracts';
import { apiRequest } from '@/lib/api-client';
import { useDemoUser } from '@/lib/demo-user';

function useRequiredDemoUserId() {
  const { demoUserId, ready } = useDemoUser();
  return { demoUserId, ready: ready && Boolean(demoUserId) };
}

export function useUsers() {
  const { demoUserId, ready, setUsers } = useDemoUser();

  const query = useQuery({
    queryKey: ['users', demoUserId],
    enabled: ready && Boolean(demoUserId),
    queryFn: async () => {
      const users = await apiRequest<User[]>('/users', { demoUserId: demoUserId! });
      setUsers(users);
      return users;
    },
  });

  // Bootstrap: first load of users without a selected demo user yet.
  const bootstrap = useQuery({
    queryKey: ['users', 'bootstrap'],
    enabled: ready && !demoUserId,
    queryFn: async () => {
      // Temporary bootstrap against first seeded user after we know one; use a
      // known seed id so the users list can populate the switcher.
      const seedId = 'clseeduser000000000000001';
      const users = await apiRequest<User[]>('/users', { demoUserId: seedId });
      setUsers(users);
      return users;
    },
  });

  return demoUserId ? query : bootstrap;
}

export function useProjects() {
  const { demoUserId, ready } = useRequiredDemoUserId();
  return useQuery({
    queryKey: ['projects', demoUserId],
    enabled: ready,
    queryFn: () => apiRequest<Project[]>('/projects', { demoUserId: demoUserId! }),
  });
}

export function useProject(projectId: string) {
  const { demoUserId, ready } = useRequiredDemoUserId();
  return useQuery({
    queryKey: ['projects', demoUserId, projectId],
    enabled: ready && Boolean(projectId),
    queryFn: () => apiRequest<Project>(`/projects/${projectId}`, { demoUserId: demoUserId! }),
  });
}

export function useProjectMembers(projectId: string) {
  const { demoUserId, ready } = useRequiredDemoUserId();
  return useQuery({
    queryKey: ['projects', demoUserId, projectId, 'members'],
    enabled: ready && Boolean(projectId),
    queryFn: () =>
      apiRequest<User[]>(`/projects/${projectId}/members`, { demoUserId: demoUserId! }),
  });
}

export function useProjectTasks(projectId: string) {
  const { demoUserId, ready } = useRequiredDemoUserId();
  return useQuery({
    queryKey: ['tasks', demoUserId, projectId],
    enabled: ready && Boolean(projectId),
    queryFn: () =>
      apiRequest<Task[]>(`/projects/${projectId}/tasks`, { demoUserId: demoUserId! }),
  });
}

export function useCreateProject() {
  const { demoUserId } = useDemoUser();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProjectInput) =>
      apiRequest<Project>('/projects', {
        method: 'POST',
        body: input,
        demoUserId: demoUserId!,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject(projectId: string) {
  const { demoUserId } = useDemoUser();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProjectInput) =>
      apiRequest<Project>(`/projects/${projectId}`, {
        method: 'PATCH',
        body: input,
        demoUserId: demoUserId!,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteProject() {
  const { demoUserId } = useDemoUser();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectId: string) =>
      apiRequest<{ id: string; deleted: true }>(`/projects/${projectId}`, {
        method: 'DELETE',
        demoUserId: demoUserId!,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useCreateTask(projectId: string) {
  const { demoUserId } = useDemoUser();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTaskInput) =>
      apiRequest<Task>(`/projects/${projectId}/tasks`, {
        method: 'POST',
        body: input,
        demoUserId: demoUserId!,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks', demoUserId, projectId] });
    },
  });
}

export function useUpdateTask(projectId: string) {
  const { demoUserId } = useDemoUser();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, input }: { taskId: string; input: UpdateTaskInput }) =>
      apiRequest<Task>(`/tasks/${taskId}`, {
        method: 'PATCH',
        body: input,
        demoUserId: demoUserId!,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks', demoUserId, projectId] });
    },
  });
}

export function useDeleteTask(projectId: string) {
  const { demoUserId } = useDemoUser();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) =>
      apiRequest<{ id: string; deleted: true }>(`/tasks/${taskId}`, {
        method: 'DELETE',
        demoUserId: demoUserId!,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks', demoUserId, projectId] });
    },
  });
}
