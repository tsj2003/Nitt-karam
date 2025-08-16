import { Task } from "../types/task";

/**
 * Binary search implementation for task filtering
 * Used when searching tasks by title, sorted alphabetically
 */
export function binarySearchTasks(
  tasks: Task[],
  query: string,
  compareFunction: (task: Task, query: string) => number
): Task[] {
  // First sort the tasks
  const sortedTasks = [...tasks].sort((a, b) => a.title.localeCompare(b.title));
  const results: Task[] = [];
  const lowerQuery = query.toLowerCase();
  
  // If query is empty, return all tasks
  if (!query.trim()) {
    return sortedTasks;
  }
  
  // Binary search to find the first matching task
  let left = 0;
  let right = sortedTasks.length - 1;
  let firstMatchIndex = -1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const comparison = compareFunction(sortedTasks[mid], lowerQuery);
    
    if (comparison === 0) {
      firstMatchIndex = mid;
      right = mid - 1; // Look for earlier matches
    } else if (comparison < 0) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  // If no match found at exact position, collect all partial matches
  if (firstMatchIndex === -1) {
    return sortedTasks.filter(task => 
      task.title.toLowerCase().includes(lowerQuery) || 
      task.description.toLowerCase().includes(lowerQuery)
    );
  }
  
  // Collect all matches from the found position
  for (let i = firstMatchIndex; i < sortedTasks.length; i++) {
    if (sortedTasks[i].title.toLowerCase().includes(lowerQuery) ||
        sortedTasks[i].description.toLowerCase().includes(lowerQuery)) {
      results.push(sortedTasks[i]);
    } else if (compareFunction(sortedTasks[i], lowerQuery) > 0) {
      // If we've moved past potential matches, stop searching
      break;
    }
  }
  
  // Also check backwards for any matches
  for (let i = firstMatchIndex - 1; i >= 0; i--) {
    if (sortedTasks[i].title.toLowerCase().includes(lowerQuery) ||
        sortedTasks[i].description.toLowerCase().includes(lowerQuery)) {
      results.push(sortedTasks[i]);
    } else if (compareFunction(sortedTasks[i], lowerQuery) < 0) {
      // If we've moved past potential matches, stop searching
      break;
    }
  }
  
  return results;
}

// Compare function for binary search
export function compareTaskTitle(task: Task, query: string): number {
  const taskTitle = task.title.toLowerCase();
  
  // Exact match
  if (taskTitle === query) {
    return 0;
  }
  
  // Prefix match
  if (taskTitle.startsWith(query)) {
    return 0;
  }
  
  // Compare lexicographically
  return taskTitle.localeCompare(query);
}

// Different sorting algorithms for task lists
export const TaskSorting = {
  // Sort by priority (highest first)
  byPriority: (tasks: Task[]): Task[] => {
    return [...tasks].sort((a, b) => {
      const priorities = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorities[b.priority] - priorities[a.priority];
    });
  },
  
  // Sort by creation date (newest first)
  byCreationDate: (tasks: Task[]): Task[] => {
    return [...tasks].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
  
  // Sort by due date (soonest first)
  byDueDate: (tasks: Task[]): Task[] => {
    return [...tasks].sort((a, b) => {
      // Tasks without due dates go to the end
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  },
  
  // Sort alphabetically by title
  byTitle: (tasks: Task[]): Task[] => {
    return [...tasks].sort((a, b) => a.title.localeCompare(b.title));
  },
  
  // Sort by category
  byCategory: (tasks: Task[]): Task[] => {
    return [...tasks].sort((a, b) => a.category.localeCompare(b.category));
  },
  
  // Sort by completion status (incomplete first)
  byCompletionStatus: (tasks: Task[]): Task[] => {
    return [...tasks].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });
  }
};