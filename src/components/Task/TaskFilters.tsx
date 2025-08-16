import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import Input from '../UI/Input';
import Select from '../UI/Select';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import { Category, Priority } from '../../types/task';
import { useTaskContext } from '../../context/TaskContext';

interface TaskFiltersProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ onSearch, searchQuery }) => {
  const { 
    filterByCategory, 
    filterByPriority, 
    selectedCategory, 
    selectedPriority,
    setSortOption,
    currentSort
  } = useTaskContext();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };
  
  const handleCategoryChange = (value: string) => {
    filterByCategory(value === 'all' ? null : value as Category);
  };
  
  const handlePriorityChange = (value: string) => {
    filterByPriority(value === 'all' ? null : value as Priority);
  };
  
  const handleSortChange = (value: string) => {
    setSortOption(value as any);
  };
  
  const handleClearFilters = () => {
    onSearch('');
    filterByCategory(null);
    filterByPriority(null);
  };
  
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'health', label: 'Health' },
    { value: 'finance', label: 'Finance' },
    { value: 'learning', label: 'Learning' },
  ];
  
  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];
  
  const sortOptions = [
    { value: 'priority', label: 'Priority' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'creationDate', label: 'Creation Date' },
    { value: 'title', label: 'Title' },
    { value: 'category', label: 'Category' },
    { value: 'completionStatus', label: 'Completion Status' },
  ];
  
  const hasActiveFilters = searchQuery || selectedCategory || selectedPriority;
  
  return (
    <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <div className="space-y-5">
        <div className="relative mb-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
            fullWidth
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select
            label="Category"
            options={categoryOptions}
            value={selectedCategory || 'all'}
            onChange={handleCategoryChange}
          />
          
          <Select
            label="Priority"
            options={priorityOptions}
            value={selectedPriority || 'all'}
            onChange={handlePriorityChange}
          />
          
          <Select
            label="Sort By"
            options={sortOptions}
            value={currentSort}
            onChange={handleSortChange}
          />
        </div>
        
        {hasActiveFilters && (
          <div className="flex items-center pt-2 justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
              
              {selectedCategory && (
                <Badge variant="primary" size="sm">
                  Category: {selectedCategory}
                </Badge>
              )}
              
              {selectedPriority && (
                <Badge variant="info" size="sm">
                  Priority: {selectedPriority}
                </Badge>
              )}
              
              {searchQuery && (
                <Badge variant="default" size="sm">
                  Search: "{searchQuery}"
                </Badge>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              startIcon={<X className="h-3 w-3" />}
            >
              Clear
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskFilters;