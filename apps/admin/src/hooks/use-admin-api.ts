'use client';

import { useQuery } from '@tanstack/react-query';
import type { AdminStats, Project, Task, User } from '@devlab/contracts';
import { apiRequest } from '@/lib/api-client';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => apiRequest<AdminStats>('/admin/stats'),
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => apiRequest<User[]>('/users'),
  });
}

export function useAdminProjects() {
  return useQuery({
    queryKey: ['admin', 'projects'],
    queryFn: () => apiRequest<Project[]>('/admin/projects'),
  });
}

export function useAdminTasks() {
  return useQuery({
    queryKey: ['admin', 'tasks'],
    queryFn: () => apiRequest<Task[]>('/admin/tasks'),
  });
}
