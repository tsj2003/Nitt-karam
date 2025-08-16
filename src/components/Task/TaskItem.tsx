import React, { useState } from 'react';
import { CheckCircle, Circle, Trash2, Edit, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import { Task, CATEGORY_COLORS, PRIORITY_COLORS } from '../../types/task';
import { useTaskContext } from '../../context/TaskContext';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { completeTask, deleteTask, getNextSequentialTask } = useTaskContext();
  const [expanded, setExpanded] = useState(false);
  const nextTask = getNextSequentialTask(task.id);
  
  const handleComplete = () => {
    completeTask(task.id);
  };
  
  const handleDelete = () => {
    deleteTask(task.id);
  };
  
  const handleEdit = () => {
    onEdit(task);
  };
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Priority badge variant
  const priorityVariant = 
    task.priority === 'urgent' ? 'danger' :
    task.priority === 'high' ? 'warning' :
    task.priority === 'medium' ? 'primary' : 'default';
  
  return (
    <div 
      className={`
        mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700
        transition-all duration-300 transform hover:shadow-md hover:-translate-y-1
        ${task.completed ? 'bg-gray-100 dark:bg-gray-800 opacity-75' : 'bg-white dark:bg-gray-800'}
      `}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {/* Completion toggle */}
            <button 
              onClick={handleComplete}
              className="mt-0.5 focus:outline-none"
              aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
            >
              {task.completed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400 hover:text-blue-500" />
              )}
            </button>
            
            {/* Task details */}
            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-2 mb-1">
                <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                  {task.title}
                </h3>
                
                {/* Priority indicator */}
                <Badge variant={priorityVariant} size="sm">
                  {task.priority}
                </Badge>
                
                {/* Category badge */}
                <div className={`h-2 w-2 rounded-full ${CATEGORY_COLORS[task.category]}`} />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {task.category}
                </span>
              </div>
              
              {task.dueDate && (
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  Due: {formatDate(task.dueDate)}
                </div>
              )}
              
              {/* Show creation date in small text */}
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Created: {formatDate(task.createdAt)}
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleExpanded}
              aria-label={expanded ? "Collapse details" : "Expand details"}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              aria-label="Edit task"
              startIcon={<Edit className="h-4 w-4" />}
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              aria-label="Delete task"
              startIcon={<Trash2 className="h-4 w-4 text-red-500" />}
            />
          </div>
        </div>
        
        {/* Expanded description */}
        {expanded && (
          <div className="mt-4 pl-8 transition-all duration-300 ease-in-out">
            <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
              {task.description || <em className="text-gray-400">No description provided</em>}
            </p>
            
            {nextTask && (
              <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-500">Next task in sequence:</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">{nextTask.title}</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Priority indicator bar at bottom */}
      <div className={`h-1 w-full ${PRIORITY_COLORS[task.priority]}`} />
    </div>
  );
};

export default TaskItem;