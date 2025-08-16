import { Priority, PRIORITY_VALUES, Task } from '../types/task';

/**
 * Min-Heap implementation for Priority Queue
 * Lower priority value = higher in queue
 */
export class PriorityQueue {
  private heap: Task[];

  constructor() {
    this.heap = [];
  }

  // Get size of the queue
  size(): number {
    return this.heap.length;
  }

  // Check if queue is empty
  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  // Get parent index of a node
  private parent(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  // Get left child index of a node
  private leftChild(index: number): number {
    return 2 * index + 1;
  }

  // Get right child index of a node
  private rightChild(index: number): number {
    return 2 * index + 2;
  }

  // Swap two elements in the heap
  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  // Get priority value (lower means higher priority)
  private getPriorityValue(task: Task): number {
    // We use negative values to turn min-heap into max-heap
    // Higher priority = should be higher in the queue
    return -PRIORITY_VALUES[task.priority];
  }

  // Insert a task into the queue
  enqueue(task: Task): void {
    // Add element to the end
    this.heap.push(task);
    
    // Fix the min heap property if violated - sift up
    let index = this.heap.length - 1;
    while (
      index > 0 &&
      this.getPriorityValue(this.heap[index]) < this.getPriorityValue(this.heap[this.parent(index)])
    ) {
      this.swap(index, this.parent(index));
      index = this.parent(index);
    }
  }

  // Remove and return the highest priority task
  dequeue(): Task | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    const root = this.heap[0];
    const lastElement = this.heap.pop()!;

    if (this.heap.length > 0) {
      // Move the last element to the root
      this.heap[0] = lastElement;
      
      // Fix the min heap property if violated - sift down
      this.heapify(0);
    }

    return root;
  }

  // Peek at the highest priority task without removing
  peek(): Task | undefined {
    return this.isEmpty() ? undefined : this.heap[0];
  }

  // Min-heapify the subtree rooted at index i
  private heapify(index: number): void {
    const left = this.leftChild(index);
    const right = this.rightChild(index);
    let smallest = index;

    if (
      left < this.heap.length &&
      this.getPriorityValue(this.heap[left]) < this.getPriorityValue(this.heap[smallest])
    ) {
      smallest = left;
    }

    if (
      right < this.heap.length &&
      this.getPriorityValue(this.heap[right]) < this.getPriorityValue(this.heap[smallest])
    ) {
      smallest = right;
    }

    if (smallest !== index) {
      this.swap(index, smallest);
      this.heapify(smallest);
    }
  }

  // Get all tasks in heap order (for display purposes)
  getAllTasksInOrder(): Task[] {
    const result: Task[] = [];
    const tempHeap = [...this.heap];
    
    while (tempHeap.length > 0) {
      result.push(this.dequeue()!);
    }
    
    // Restore the heap
    for (const task of result) {
      this.enqueue(task);
    }
    
    return result;
  }

  // Update a task in the queue
  updateTask(taskId: string, updatedTask: Partial<Task>): boolean {
    const index = this.heap.findIndex(task => task.id === taskId);
    
    if (index === -1) {
      return false;
    }
    
    // Update task
    this.heap[index] = { ...this.heap[index], ...updatedTask };
    
    // Re-heapify
    this.heapify(0);
    return true;
  }

  // Remove a task from the queue by ID
  removeTask(taskId: string): boolean {
    const index = this.heap.findIndex(task => task.id === taskId);
    
    if (index === -1) {
      return false;
    }
    
    // Replace with the last element
    const lastElement = this.heap.pop()!;
    
    if (index < this.heap.length) {
      this.heap[index] = lastElement;
      this.heapify(index);
    }
    
    return true;
  }
}