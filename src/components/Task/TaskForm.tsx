import React, { useState, useEffect } from 'react';
import { X, Calendar, Plus, Save } from 'lucide-react';
import Input from '../UI/Input';
import Select from '../UI/Select';
import Button from '../UI/Button';
import { Task, Priority, Category } from '../../types/task';
import { useTaskContext } from '../../context/TaskContext';

interface TaskFormProps {
  onClose: () => void;
  editTask?: Task;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, editTask }) => {
  const { addTask, updateTask, tasks } = useTaskContext();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('personal');
  const [dueDate, setDueDate] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dependencyId, setDependencyId] = useState<string>('');
  
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      setPriority(editTask.priority);
      setCategory(editTask.category);
      setDueDate(editTask.dueDate ? new Date(editTask.dueDate).toISOString().split('T')[0] : '');
      setDependencyId(editTask.next || '');
    }
  }, [editTask]);
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    const taskData = {
      title,
      description,
      priority,
      category,
      completed: editTask ? editTask.completed : false,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      next: dependencyId || undefined,
    };
    
    if (editTask) {
      updateTask(editTask.id, taskData);
    } else {
      addTask(taskData);
    }
    
    onClose();
  };
  
  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];
  
  const categoryOptions = [
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'health', label: 'Health' },
    { value: 'finance', label: 'Finance' },
    { value: 'learning', label: 'Learning' },
  ];
  
  const dependencyOptions = [
    { value: '', label: 'None' },
    ...tasks
      .filter(t => !editTask || t.id !== editTask.id)
      .map(t => ({ value: t.id, label: t.title })),
  ];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {editTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            aria-label="Close"
            startIcon={<X className="h-4 w-4" />}
          />
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <Input
              label="Title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              error={errors.title}
              required
              fullWidth
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Priority"
                options={priorityOptions}
                value={priority}
                onChange={(value) => setPriority(value as Priority)}
              />
              
              <Select
                label="Category"
                options={categoryOptions}
                value={category}
                onChange={(value) => setCategory(value as Category)}
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description (optional)"
              />
            </div>
            
            <div className="relative">
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date (optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="pl-10"
                  fullWidth
                />
              </div>
            </div>
            
            <Select
              label="Depends On (optional)"
              options={dependencyOptions}
              value={dependencyId}
              onChange={setDependencyId}
            />
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>
            
            <Button
              variant="primary"
              type="submit"
              startIcon={editTask ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            >
              {editTask ? 'Save Changes' : 'Add Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;