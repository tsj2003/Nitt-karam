import { Task } from '../types/task';

class TaskNode {
  task: Task;
  next: TaskNode | null = null;
  
  constructor(task: Task) {
    this.task = task;
  }
}

/**
 * Linked List implementation for sequential task storage and traversal
 */
export class TaskLinkedList {
  private head: TaskNode | null = null;
  private tail: TaskNode | null = null;
  private taskMap: Map<string, TaskNode> = new Map();
  private size: number = 0;
  
  // Add task to the end of the list
  append(task: Task): void {
    const newNode = new TaskNode(task);
    this.taskMap.set(task.id, newNode);
    
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      if (this.tail) {
        this.tail.next = newNode;
        this.tail = newNode;
      }
    }
    
    this.size++;
  }
  
  // Add task after another task (by ID)
  insertAfter(taskId: string, newTask: Task): boolean {
    const node = this.taskMap.get(taskId);
    
    if (!node) {
      return false;
    }
    
    const newNode = new TaskNode(newTask);
    this.taskMap.set(newTask.id, newNode);
    
    newNode.next = node.next;
    node.next = newNode;
    
    if (node === this.tail) {
      this.tail = newNode;
    }
    
    this.size++;
    return true;
  }
  
  // Remove a task by ID
  remove(taskId: string): boolean {
    if (!this.head) return false;
    
    if (this.head.task.id === taskId) {
      this.head = this.head.next;
      this.taskMap.delete(taskId);
      this.size--;
      
      if (!this.head) {
        this.tail = null;
      }
      
      return true;
    }
    
    let current = this.head;
    while (current.next && current.next.task.id !== taskId) {
      current = current.next;
    }
    
    if (current.next) {
      if (current.next === this.tail) {
        this.tail = current;
      }
      
      current.next = current.next.next;
      this.taskMap.delete(taskId);
      this.size--;
      
      return true;
    }
    
    return false;
  }
  
  // Get a task by ID
  getTask(taskId: string): Task | null {
    const node = this.taskMap.get(taskId);
    return node ? node.task : null;
  }
  
  // Update a task by ID
  updateTask(taskId: string, updatedTask: Partial<Task>): boolean {
    const node = this.taskMap.get(taskId);
    
    if (!node) {
      return false;
    }
    
    node.task = { ...node.task, ...updatedTask };
    return true;
  }
  
  // Get all tasks in order
  getAllTasks(): Task[] {
    const tasks: Task[] = [];
    let current = this.head;
    
    while (current) {
      tasks.push(current.task);
      current = current.next;
    }
    
    return tasks;
  }
  
  // Check if the list is empty
  isEmpty(): boolean {
    return this.size === 0;
  }
  
  // Get the number of tasks in the list
  getSize(): number {
    return this.size;
  }

  // Get the next sequential task for a given task ID
  getNextTask(taskId: string): Task | null {
    const node = this.taskMap.get(taskId);
    
    if (!node || !node.next) {
      return null;
    }
    
    return node.next.task;
  }
}