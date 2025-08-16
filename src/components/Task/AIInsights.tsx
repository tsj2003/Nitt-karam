import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, Target, AlertTriangle, Lightbulb, BarChart3 } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { Task, Priority, Category } from '../../types/task';

interface Insight {
  type: 'productivity' | 'time' | 'priority' | 'category' | 'recommendation';
  title: string;
  description: string;
  value?: string | number;
  icon: React.ReactNode;
  color: string;
}

const AIInsights: React.FC = () => {
  const { tasks } = useTaskContext();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tasks.length > 0) {
      generateInsights();
    }
    setLoading(false);
  }, [tasks]);

  const generateInsights = () => {
    const newInsights: Insight[] = [];

    // Calculate basic metrics
    const completedTasks = tasks.filter(task => task.completed);
    const pendingTasks = tasks.filter(task => !task.completed);
    const urgentTasks = tasks.filter(task => task.priority === 'urgent' && !task.completed);
    const overdueTasks = tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
    );

    // Productivity insight
    const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
    newInsights.push({
      type: 'productivity',
      title: 'Completion Rate',
      description: completionRate >= 70 ? 'Excellent productivity!' : 
                   completionRate >= 50 ? 'Good progress, keep it up!' : 
                   'Consider breaking down complex tasks',
      value: `${completionRate.toFixed(1)}%`,
      icon: <TrendingUp className="h-5 w-5" />,
      color: completionRate >= 70 ? 'text-green-600' : completionRate >= 50 ? 'text-yellow-600' : 'text-red-600'
    });

    // Time management insight
    const avgCompletionTime = calculateAverageCompletionTime();
    newInsights.push({
      type: 'time',
      title: 'Average Task Duration',
      description: avgCompletionTime > 0 ? 
        `Tasks typically take ${avgCompletionTime} days to complete` : 
        'Track your task completion times for better planning',
      value: avgCompletionTime > 0 ? `${avgCompletionTime}d` : 'N/A',
      icon: <Clock className="h-5 w-5" />,
      color: 'text-blue-600'
    });

    // Priority distribution insight
    const priorityDistribution = getPriorityDistribution();
    const mostCommonPriority = Object.entries(priorityDistribution)
      .sort(([,a], [,b]) => b - a)[0];
    
    newInsights.push({
      type: 'priority',
      title: 'Priority Focus',
      description: `Most tasks are ${mostCommonPriority[0]} priority. ${getPriorityAdvice(mostCommonPriority[0] as Priority)}`,
      value: `${(mostCommonPriority[1] / tasks.length * 100).toFixed(0)}%`,
      icon: <Target className="h-5 w-5" />,
      color: 'text-purple-600'
    });

    // Category balance insight
    const categoryDistribution = getCategoryDistribution();
    const categoryAdvice = getCategoryBalanceAdvice(categoryDistribution);
    newInsights.push({
      type: 'category',
      title: 'Category Balance',
      description: categoryAdvice,
      value: Object.keys(categoryDistribution).length,
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'text-indigo-600'
    });

    // Urgent tasks warning
    if (urgentTasks.length > 0) {
      newInsights.push({
        type: 'recommendation',
        title: 'Urgent Tasks Alert',
        description: `You have ${urgentTasks.length} urgent task${urgentTasks.length > 1 ? 's' : ''} pending. Focus on these first!`,
        value: urgentTasks.length,
        icon: <AlertTriangle className="h-5 w-5" />,
        color: 'text-red-600'
      });
    }

    // Overdue tasks warning
    if (overdueTasks.length > 0) {
      newInsights.push({
        type: 'recommendation',
        title: 'Overdue Tasks',
        description: `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}. Consider rescheduling or delegating.`,
        value: overdueTasks.length,
        icon: <AlertTriangle className="h-5 w-5" />,
        color: 'text-orange-600'
      });
    }

    // Smart recommendations
    const recommendations = generateSmartRecommendations();
    recommendations.forEach(rec => {
      newInsights.push({
        type: 'recommendation',
        title: 'Smart Tip',
        description: rec,
        icon: <Lightbulb className="h-5 w-5" />,
        color: 'text-green-600'
      });
    });

    setInsights(newInsights);
  };

  const calculateAverageCompletionTime = (): number => {
    const completedTasksWithDates = tasks.filter(task => task.completed && task.createdAt);
    if (completedTasksWithDates.length === 0) return 0;

    const totalDays = completedTasksWithDates.reduce((sum, task) => {
      const created = new Date(task.createdAt);
      const completed = new Date(); // Assuming completion time is now
      const daysDiff = (completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      return sum + daysDiff;
    }, 0);

    return Math.round(totalDays / completedTasksWithDates.length);
  };

  const getPriorityDistribution = () => {
    const distribution: Record<Priority, number> = {
      low: 0, medium: 0, high: 0, urgent: 0
    };
    
    tasks.forEach(task => {
      distribution[task.priority]++;
    });
    
    return distribution;
  };

  const getCategoryDistribution = () => {
    const distribution: Record<Category, number> = {
      work: 0, personal: 0, health: 0, finance: 0, learning: 0
    };
    
    tasks.forEach(task => {
      distribution[task.category]++;
    });
    
    return distribution;
  };

  const getPriorityAdvice = (priority: Priority): string => {
    switch (priority) {
      case 'urgent':
        return 'Consider if all tasks truly need urgent attention.';
      case 'high':
        return 'Good focus on important tasks.';
      case 'medium':
        return 'Balanced approach to task prioritization.';
      case 'low':
        return 'Consider elevating important tasks to higher priority.';
      default:
        return '';
    }
  };

  const getCategoryBalanceAdvice = (distribution: Record<Category, number>): string => {
    const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    const percentages = Object.entries(distribution).map(([category, count]) => ({
      category,
      percentage: (count / total) * 100
    }));

    const maxCategory = percentages.reduce((max, current) => 
      current.percentage > max.percentage ? current : max
    );

    if (maxCategory.percentage > 60) {
      return `Heavy focus on ${maxCategory.category}. Consider diversifying your tasks.`;
    } else if (maxCategory.percentage < 20) {
      return 'Good balance across categories.';
    } else {
      return 'Well-distributed task categories.';
    }
  };

  const generateSmartRecommendations = (): string[] => {
    const recommendations: string[] = [];

    // Task volume recommendations
    if (tasks.length > 20) {
      recommendations.push('You have many tasks. Consider batch processing similar tasks.');
    } else if (tasks.length < 5) {
      recommendations.push('Low task volume. Great time to plan and set new goals!');
    }

    // Completion pattern recommendations
    const recentTasks = tasks.filter(task => 
      new Date(task.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    if (recentTasks.length > 10) {
      recommendations.push('High task creation rate. Focus on completion over creation.');
    }

    // Due date recommendations
    const tasksWithDueDates = tasks.filter(task => task.dueDate);
    if (tasksWithDueDates.length < tasks.length * 0.3) {
      recommendations.push('Add due dates to more tasks for better time management.');
    }

    return recommendations.slice(0, 2); // Limit to 2 recommendations
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lightbulb className="h-8 w-8 text-gray-400 dark:text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            No Insights Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            Create some tasks to get AI-powered insights and recommendations!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center mb-6">
        <div className="bg-gray-900 dark:bg-white p-2.5 rounded-xl mr-4">
          <BarChart3 className="h-5 w-5 text-white dark:text-gray-900" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Insights
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Smart recommendations for your productivity
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-sm transition-all duration-200">
            <div className="bg-gray-200 dark:bg-gray-600 p-2 rounded-lg mt-0.5">
              <div className={insight.color}>
                {insight.icon}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                  {insight.title}
                </h4>
                {insight.value && (
                  <span className="text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-full">
                    {insight.value}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {insight.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
