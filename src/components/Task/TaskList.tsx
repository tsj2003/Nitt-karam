import React, { useState } from 'react';
import { ListChecks, PlusCircle, Sparkles } from 'lucide-react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import AITaskForm from './AITaskForm';
import TaskFilters from './TaskFilters';
import Button from '../UI/Button';
import Spinner from '../UI/Spinner';
import { Task } from '../../types/task';
import { useTaskContext } from '../../context/TaskContext';

const TaskList: React.FC = () => {
  const { filteredTasks, searchTasks, searchQuery, loading } = useTaskContext();
  const [showForm, setShowForm] = useState(false);
  const [showAIForm, setShowAIForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  
  const handleSearch = (query: string) => {
    searchTasks(query);
  };
  
  const handleCreateTask = () => {
    setEditingTask(undefined);
    setShowForm(true);
  };
  
  const handleCreateAITask = () => {
    setEditingTask(undefined);
    setShowAIForm(true);
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    setShowAIForm(false);
    setEditingTask(undefined);
  };
  
    return (
    <div className="w-full">
      <div className="card-modern p-8 mb-8 mt-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
              <div className="flex items-center group">
                <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-3 md:p-4 lg:p-5 rounded-2xl md:rounded-3xl shadow-2xl mr-4 md:mr-6 lg:mr-8 transform group-hover:scale-110 transition-all duration-300">
                  <img 
                    src="/image.png" 
                    alt="Khanda - Sikh Symbol"
                    className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12"
                  />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-2 md:mb-3">Your Tasks</h2>
                  <p className="text-white/80 text-base md:text-lg lg:text-xl font-medium">Premium task management experience</p>
                </div>
              </div>
                      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6 items-center">
              <button 
                onClick={handleCreateAITask}
                className="bg-white/20 backdrop-blur-xl border border-white/30 hover:bg-white/30 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-2 md:space-x-3 shadow-xl w-full sm:w-auto"
              >
                <div className="bg-white/20 p-1.5 md:p-2 rounded-full">
                  <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <span className="text-base md:text-lg">AI Task</span>
              </button>
              <button 
                onClick={handleCreateTask}
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-2 md:space-x-3 shadow-2xl hover:shadow-3xl w-full sm:w-auto"
              >
                <div className="bg-white/20 p-1.5 md:p-2 rounded-full">
                  <PlusCircle className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <span className="text-base md:text-lg">Add Task</span>
              </button>
            </div>
        </div>
      </div>
      
      <TaskFilters 
        onSearch={handleSearch} 
        searchQuery={searchQuery}
      />
      
      {loading ? (
        <div className="flex justify-center items-center p-12">
          <Spinner size="lg" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="card-modern p-16 text-center">
          <div className="glass w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8">
            <ListChecks className="h-16 w-16 text-white/60" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-6">No tasks found</h3>
          <p className="text-white/70 mb-10 max-w-lg mx-auto text-xl leading-relaxed">
            {searchQuery 
              ? "No tasks match your search criteria. Try adjusting your filters or search terms." 
              : "Ready to get organized? Start by creating your first task or use AI to break down complex goals!"}
          </p>
          {!searchQuery && (
            <div className="flex justify-center space-x-6">
              <button 
                onClick={handleCreateAITask}
                className="btn-secondary flex items-center space-x-2"
              >
                <Sparkles className="h-5 w-5" />
                <span>Try AI Task</span>
              </button>
              <button 
                onClick={handleCreateTask}
                className="btn-primary flex items-center space-x-2"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Create Task</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onEdit={handleEditTask}
            />
          ))}
        </div>
      )}
      
      {showForm && (
        <TaskForm 
          onClose={handleCloseForm} 
          editTask={editingTask}
        />
      )}
      
      {showAIForm && (
        <AITaskForm 
          onClose={handleCloseForm} 
          editTask={editingTask}
        />
      )}
    </div>
  );
};

export default TaskList;