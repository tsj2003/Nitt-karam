import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Priority, Category } from '../types/task';
import { PriorityQueue } from '../data-structures/priority-queue';
import { TaskLinkedList } from '../data-structures/linked-list';
import { binarySearchTasks, compareTaskTitle, TaskSorting } from '../data-structures/search-algorithms';
import { v4 as uuidv4 } from 'uuid';

type SortOption = 'priority' | 'dueDate' | 'creationDate' | 'title' | 'category' | 'completionStatus';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  searchTasks: (query: string) => void;
  filterByCategory: (category: Category | null) => void;
  filterByPriority: (priority: Priority | null) => void;
  setSortOption: (option: SortOption) => void;
  currentSort: SortOption;
  loading: boolean;
  searchQuery: string;
  selectedCategory: Category | null;
  selectedPriority: Priority | null;
  getNextSequentialTask: (taskId: string) => Task | null;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [priorityQueue] = useState<PriorityQueue>(new PriorityQueue());
  const [linkedList] = useState<TaskLinkedList>(new TaskLinkedList());
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null);
  const [currentSort, setCurrentSort] = useState<SortOption>('priority');

  // Load tasks from local storage on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        // Simulate loading from a database
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
          const parsedTasks = JSON.parse(storedTasks, (key, value) => {
            if (key === 'createdAt' || key === 'dueDate') {
              return value ? new Date(value) : value;
            }
            return value;
          });
          
          setTasks(parsedTasks);
          
          // Add tasks to our data structures
          for (const task of parsedTasks) {
            priorityQueue.enqueue(task);
            linkedList.append(task);
          }
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTasks();
  }, [priorityQueue, linkedList]);

  // Save tasks to local storage whenever tasks change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, loading]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...tasks];
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(task => task.category === selectedCategory);
    }
    
    // Apply priority filter
    if (selectedPriority) {
      result = result.filter(task => task.priority === selectedPriority);
    }
    
    // Apply search filter
    if (searchQuery) {
      result = binarySearchTasks(result, searchQuery, compareTaskTitle);
    }
    
    // Apply sorting
    switch (currentSort) {
      case 'priority':
        result = TaskSorting.byPriority(result);
        break;
      case 'dueDate':
        result = TaskSorting.byDueDate(result);
        break;
      case 'creationDate':
        result = TaskSorting.byCreationDate(result);
        break;
      case 'title':
        result = TaskSorting.byTitle(result);
        break;
      case 'category':
        result = TaskSorting.byCategory(result);
        break;
      case 'completionStatus':
        result = TaskSorting.byCompletionStatus(result);
        break;
      default:
        break;
    }
    
    setFilteredTasks(result);
  }, [tasks, searchQuery, selectedCategory, selectedPriority, currentSort]);

  // Add a new task
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date(),
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    priorityQueue.enqueue(newTask);
    linkedList.append(newTask);
  };

  // Update a task
  const updateTask = (id: string, updatedTaskData: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, ...updatedTaskData } : task
      )
    );
    
    priorityQueue.updateTask(id, updatedTaskData);
    linkedList.updateTask(id, updatedTaskData);
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    priorityQueue.removeTask(id);
    linkedList.remove(id);
  };

  // Mark a task as completed
  const completeTask = (id: string) => {
    updateTask(id, { completed: true });
  };

  // Search tasks
  const searchTasks = (query: string) => {
    setSearchQuery(query);
  };

  // Filter by category
  const filterByCategory = (category: Category | null) => {
    setSelectedCategory(category);
  };

  // Filter by priority
  const filterByPriority = (priority: Priority | null) => {
    setSelectedPriority(priority);
  };

  // Set sort option
  const setSortOption = (option: SortOption) => {
    setCurrentSort(option);
  };

  // Get the next sequential task
  const getNextSequentialTask = (taskId: string): Task | null => {
    return linkedList.getNextTask(taskId);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        searchTasks,
        filterByCategory,
        filterByPriority,
        setSortOption,
        currentSort,
        loading,
        searchQuery,
        selectedCategory,
        selectedPriority,
        getNextSequentialTask
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};