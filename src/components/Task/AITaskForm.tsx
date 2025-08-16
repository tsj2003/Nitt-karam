import React, { useState, useEffect } from 'react';
import { X, Calendar, Plus, Save, Sparkles, Clock, Brain, Settings } from 'lucide-react';
import Input from '../UI/Input';
import Select from '../UI/Select';
import Button from '../UI/Button';
import Spinner from '../UI/Spinner';
import { Task, Priority, Category } from '../../types/task';
import { useTaskContext } from '../../context/TaskContext';
import { aiService } from '../../utils/aiService';

interface AITaskFormProps {
  onClose: () => void;
  editTask?: Task;
}

const AITaskForm: React.FC<AITaskFormProps> = ({ onClose, editTask }) => {
  const { addTask, updateTask, tasks } = useTaskContext();
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('personal');
  const [dueDate, setDueDate] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dependencyId, setDependencyId] = useState<string>('');
  
  // AI states
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [showAIOptions, setShowAIOptions] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [timeEstimationReasoning, setTimeEstimationReasoning] = useState('');
  const [breakdownResults, setBreakdownResults] = useState<any>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(false);
  
  // API Key states
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem('geminiApiKey') || '');
  const [huggingFaceToken, setHuggingFaceToken] = useState(localStorage.getItem('huggingFaceToken') || '');
  
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

  // AI Functions
  const handleNaturalLanguageParse = async () => {
    if (!naturalLanguageInput.trim()) return;
    
    setIsProcessingAI(true);
    setParseSuccess(false);
    try {
      const parsed = await aiService.parseNaturalLanguage(naturalLanguageInput);
      
      setTitle(parsed.title || '');
      setDescription(parsed.description || '');
      setPriority(parsed.priority || 'medium');
      setCategory(parsed.category || 'personal');
      setDueDate(parsed.dueDate ? parsed.dueDate.toISOString().split('T')[0] : '');
      
      // Clear the natural language input
      setNaturalLanguageInput('');
      
      // Auto-trigger task breakdown for better UX
      if (parsed.title && parsed.title !== naturalLanguageInput) {
        // Show a success message
        console.log('Task parsed successfully:', parsed);
        setParseSuccess(true);
        
        // Auto-trigger task breakdown
        setTimeout(() => {
          handleTaskBreakdown();
        }, 1000); // Give user time to see the parsed results
      }
      
    } catch (error) {
      console.error('Failed to parse natural language:', error);
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleTimeEstimation = async () => {
    if (!title.trim()) return;
    
    setIsProcessingAI(true);
    try {
      const estimation = await aiService.estimateTaskTime(title, description);
      setEstimatedTime(estimation.estimatedMinutes);
      setTimeEstimationReasoning(estimation.reasoning);
    } catch (error) {
      console.error('Failed to estimate time:', error);
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleTaskBreakdown = async () => {
    if (!title.trim()) return;
    
    setIsProcessingAI(true);
    try {
      // Use the original natural language input if available, otherwise use title + description
      const taskText = naturalLanguageInput.trim() || (title + (description ? ': ' + description : ''));
      const breakdown = await aiService.breakdownTask(taskText);
      setBreakdownResults(breakdown);
      setShowBreakdown(true);
      
      // Show success message
      console.log('Task breakdown successful:', breakdown);
    } catch (error) {
      console.error('Failed to breakdown task:', error);
      // Show error message to user
      alert('Failed to breakdown task. Please try again or check your API key.');
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleCreateSubtasks = async () => {
    if (!breakdownResults?.subtasks) return;
    
    try {
      for (const subtask of breakdownResults.subtasks) {
        await addTask({
          title: subtask.title,
          description: subtask.description,
          priority: subtask.priority,
          category: subtask.category,
          completed: false,
          dueDate: dueDate ? new Date(dueDate) : undefined,
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to create subtasks:', error);
    }
  };

  const saveApiKeys = () => {
    aiService.setGeminiApiKey(geminiApiKey);
    aiService.setHuggingFaceToken(huggingFaceToken);
    setShowApiSettings(false);
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {editTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowApiSettings(!showApiSettings)}
              startIcon={<Settings className="h-4 w-4" />}
            >
              AI Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              startIcon={<X className="h-4 w-4" />}
            />
          </div>
        </div>

        {/* API Settings Panel */}
        {showApiSettings && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">AI API Configuration</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gemini API Key (Free)
                </label>
                <Input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="Get free key from https://makersuite.google.com/app/apikey"
                  className="text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hugging Face Token (Optional)
                </label>
                <Input
                  type="password"
                  value={huggingFaceToken}
                  onChange={(e) => setHuggingFaceToken(e.target.value)}
                  placeholder="Get free token from https://huggingface.co/settings/tokens"
                  className="text-xs"
                />
              </div>
              <Button variant="primary" size="sm" onClick={saveApiKeys}>
                Save API Keys
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                    {/* Natural Language Input */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-gray-900 dark:bg-white p-2.5 rounded-xl mr-4">
              <Sparkles className="h-5 w-5 text-white dark:text-gray-900" />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-900 dark:text-white">
                Natural Language Input
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Describe your task in plain English
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <Input
              value={naturalLanguageInput}
              onChange={(e) => setNaturalLanguageInput(e.target.value)}
              placeholder="e.g., Buy groceries tomorrow with high priority"
              className="flex-1 text-base border-gray-200 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white focus:ring-1 focus:ring-gray-900 dark:focus:ring-white"
            />
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Examples: "Study for exams", "Buy a new phone", "Plan vacation"
              </div>
              <Button
                type="button"
                variant="primary"
                onClick={handleNaturalLanguageParse}
                disabled={!naturalLanguageInput.trim() || isProcessingAI}
                startIcon={isProcessingAI ? <Spinner size="sm" /> : <Brain className="h-4 w-4" />}
                className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200"
              >
                {isProcessingAI ? 'Processing...' : 'Parse with AI'}
              </Button>
            </div>
            
            {isProcessingAI && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl text-center border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-center space-x-3">
                  <Spinner size="sm" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    AI is processing your task...
                  </span>
                </div>
              </div>
            )}
            
            {parseSuccess && !isProcessingAI && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl text-center border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-gray-600 dark:text-gray-300">✓</span>
                  <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                    Task parsed successfully! Breaking down into subtasks...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

          {/* AI Options */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-gray-900 dark:bg-white p-2.5 rounded-xl mr-4">
                  <Brain className="h-5 w-5 text-white dark:text-gray-900" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    AI Analysis
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    Get smart insights about your task
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAIOptions(!showAIOptions)}
                className="text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200 px-4 py-2 rounded-xl"
              >
                {showAIOptions ? 'Hide' : 'Show'}
              </Button>
            </div>

            {showAIOptions && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleTimeEstimation}
                    disabled={!title.trim() || isProcessingAI}
                    startIcon={isProcessingAI ? <Spinner size="sm" /> : <Clock className="h-4 w-4" />}
                    className="bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600 px-4 py-2.5 rounded-xl font-medium"
                  >
                    Estimate Time
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleTaskBreakdown}
                    disabled={!title.trim() || isProcessingAI}
                    startIcon={isProcessingAI ? <Spinner size="sm" /> : <Brain className="h-4 w-4" />}
                    className="bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600 px-4 py-2.5 rounded-xl font-medium"
                  >
                    Break Down Task
                  </Button>
                </div>
                
                {estimatedTime && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center mb-3">
                      <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-2" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Estimated Time: {estimatedTime} minutes
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-600 p-3 rounded-lg">
                      {timeEstimationReasoning}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Task Breakdown Results */}
          {showBreakdown && breakdownResults && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="bg-gray-900 dark:bg-white p-2.5 rounded-xl mr-4">
                    <Brain className="h-5 w-5 text-white dark:text-gray-900" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Task Breakdown
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {breakdownResults.subtasks.length} subtasks created
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleCreateSubtasks}
                  startIcon={<Plus className="h-4 w-4" />}
                  className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white px-6 py-2.5 rounded-xl font-medium"
                >
                  Create All Subtasks
                </Button>
              </div>
              
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {breakdownResults.subtasks.map((subtask: any, index: number) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white mb-2 text-base">
                          {index + 1}. {subtask.title}
                        </div>
                        <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                          {subtask.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-full">
                        {subtask.priority}
                      </span>
                      <span className="text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-full">
                        {subtask.category}
                      </span>
                      <span className="text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-full">
                        {subtask.estimatedTime}m
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                <div className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                  Total Estimated Time: {Math.round(breakdownResults.totalEstimatedTime / 60 * 10) / 10} hours
                </div>
              </div>
            </div>
          )}

          {/* Regular Form Fields */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              Task Details
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  error={errors.title}
                  className="text-base border-gray-200 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white focus:ring-1 focus:ring-gray-900 dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more details about your task..."
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white dark:bg-gray-700 dark:text-white resize-none text-base"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              Task Settings
            </h3>
            
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  options={priorityOptions}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  options={categoryOptions}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 mt-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  startIcon={<Calendar className="h-4 w-4" />}
                  className="border-gray-200 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white focus:ring-1 focus:ring-gray-900 dark:focus:ring-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dependency
                </label>
                <Select
                  value={dependencyId}
                  onChange={(e) => setDependencyId(e.target.value)}
                  options={dependencyOptions}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-8">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200 font-medium"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              startIcon={<Save className="h-4 w-4" />}
              className="px-8 py-3 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white font-medium rounded-xl transition-all duration-200"
            >
              {editTask ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AITaskForm;

