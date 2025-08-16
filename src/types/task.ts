export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Category = 'work' | 'personal' | 'health' | 'finance' | 'learning';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  createdAt: Date;
  dueDate?: Date;
  next?: string; // For linked list implementation - ID of the next task
}

export const PRIORITY_VALUES: Record<Priority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
};

export const CATEGORY_COLORS: Record<Category, string> = {
  work: 'bg-blue-500',
  personal: 'bg-purple-500',
  health: 'bg-green-500',
  finance: 'bg-yellow-500',
  learning: 'bg-pink-500',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'bg-gray-300 dark:bg-gray-600',
  medium: 'bg-blue-400 dark:bg-blue-600',
  high: 'bg-orange-400 dark:bg-orange-600',
  urgent: 'bg-red-500 dark:bg-red-600',
};