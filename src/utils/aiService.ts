import axios from 'axios';
import { Task, Priority, Category } from '../types/task';

// Free AI APIs - you can get free API keys from these services
const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// You can get free API keys from:
// Hugging Face: https://huggingface.co/settings/tokens
// Gemini: https://makersuite.google.com/app/apikey

interface AITaskBreakdown {
  subtasks: {
    title: string;
    description: string;
    estimatedTime: number; // in minutes
    priority: Priority;
    category: Category;
  }[];
  totalEstimatedTime: number;
}

interface TimeEstimation {
  estimatedMinutes: number;
  confidence: 'low' | 'medium' | 'high';
  reasoning: string;
}

export class AIService {
  private huggingFaceToken: string;
  private geminiApiKey: string;

  constructor() {
    // Get API keys from environment variables or localStorage
    this.huggingFaceToken = localStorage.getItem('huggingFaceToken') || '';
    this.geminiApiKey = localStorage.getItem('geminiApiKey') || '';
  }

  setHuggingFaceToken(token: string) {
    this.huggingFaceToken = token;
    localStorage.setItem('huggingFaceToken', token);
  }

  setGeminiApiKey(key: string) {
    this.geminiApiKey = key;
    localStorage.setItem('geminiApiKey', key);
  }

  // AI Task Breakdown - breaks complex tasks into subtasks
  async breakdownTask(taskDescription: string): Promise<AITaskBreakdown> {
    try {
      if (!this.geminiApiKey) {
        // Fallback to local logic if no API key
        return this.localTaskBreakdown(taskDescription);
      }

      const prompt = `
        Break down this task into 5-8 specific, actionable subtasks. For each subtask, provide:
        - A clear, specific title
        - A brief description
        - Estimated time in minutes (be realistic)
        - Priority (low, medium, high, urgent)
        - Category (work, personal, health, finance, learning)
        
        Task: "${taskDescription}"
        
        Return as JSON format:
        {
          "subtasks": [
            {
              "title": "Subtask title",
              "description": "What needs to be done",
              "estimatedTime": 30,
              "priority": "medium",
              "category": "work"
            }
          ],
          "totalEstimatedTime": 120
        }
      `;

      const response = await axios.post(
        `${GEMINI_API_URL}?key=${this.geminiApiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }
      );

      const result = response.data.candidates[0].content.parts[0].text;
      const parsed = JSON.parse(result);
      
      return {
        subtasks: parsed.subtasks,
        totalEstimatedTime: parsed.totalEstimatedTime
      };
    } catch (error) {
      console.error('AI breakdown failed, using local fallback:', error);
      return this.localTaskBreakdown(taskDescription);
    }
  }

  // Local fallback for task breakdown
  private localTaskBreakdown(taskDescription: string): AITaskBreakdown {
    const lowerTask = taskDescription.toLowerCase();
    
    // Simple keyword-based breakdown
    const subtasks = [];
    
    if (lowerTask.includes('plan') || lowerTask.includes('organize')) {
      subtasks.push(
        {
          title: 'Research and gather information',
          description: 'Collect all necessary details and requirements',
          estimatedTime: 30,
          priority: 'high' as Priority,
          category: 'work' as Category
        },
        {
          title: 'Create timeline and milestones',
          description: 'Break down the project into phases with deadlines',
          estimatedTime: 45,
          priority: 'high' as Priority,
          category: 'work' as Category
        },
        {
          title: 'Assign responsibilities',
          description: 'Determine who will handle each part of the task',
          estimatedTime: 20,
          priority: 'medium' as Priority,
          category: 'work' as Category
        }
      );
    } else if (lowerTask.includes('study') || lowerTask.includes('learn')) {
      subtasks.push(
        {
          title: 'Review materials and resources',
          description: 'Go through study materials and identify key concepts',
          estimatedTime: 60,
          priority: 'high' as Priority,
          category: 'learning' as Category
        },
        {
          title: 'Create study schedule',
          description: 'Plan study sessions and allocate time for practice',
          estimatedTime: 15,
          priority: 'medium' as Priority,
          category: 'learning' as Category
        },
        {
          title: 'Practice and apply knowledge',
          description: 'Complete exercises and apply what you\'ve learned',
          estimatedTime: 90,
          priority: 'high' as Priority,
          category: 'learning' as Category
        }
      );
    } else if (lowerTask.includes('buy') || lowerTask.includes('shop') || lowerTask.includes('purchase')) {
      // Shopping task breakdown
      if (lowerTask.includes('phone')) {
        subtasks.push(
          {
            title: 'Research phone models and features',
            description: 'Compare different phone brands, models, and specifications',
            estimatedTime: 45,
            priority: 'high' as Priority,
            category: 'personal' as Category
          },
          {
            title: 'Check prices and deals',
            description: 'Compare prices across different stores and online retailers',
            estimatedTime: 30,
            priority: 'medium' as Priority,
            category: 'finance' as Category
          },
          {
            title: 'Visit stores or order online',
            description: 'Go to physical stores or place online order',
            estimatedTime: 60,
            priority: 'high' as Priority,
            category: 'personal' as Category
          },
          {
            title: 'Set up and transfer data',
            description: 'Configure new phone and transfer contacts/apps',
            estimatedTime: 45,
            priority: 'medium' as Priority,
            category: 'personal' as Category
          }
        );
      } else if (lowerTask.includes('shoes')) {
        subtasks.push(
          {
            title: 'Determine shoe requirements',
            description: 'Identify style, size, comfort, and purpose needed',
            estimatedTime: 15,
            priority: 'medium' as Priority,
            category: 'personal' as Category
          },
          {
            title: 'Research brands and styles',
            description: 'Look for shoes that match your requirements and budget',
            estimatedTime: 30,
            priority: 'medium' as Priority,
            category: 'personal' as Category
          },
          {
            title: 'Try on and test comfort',
            description: 'Visit stores to try different pairs and walk around',
            estimatedTime: 45,
            priority: 'high' as Priority,
            category: 'personal' as Category
          },
          {
            title: 'Make purchase decision',
            description: 'Choose the best option and complete the purchase',
            estimatedTime: 20,
            priority: 'high' as Priority,
            category: 'finance' as Category
          }
        );
      } else {
        // Generic shopping breakdown
        subtasks.push(
          {
            title: 'Research products and options',
            description: 'Compare different products, brands, and prices',
            estimatedTime: 30,
            priority: 'medium' as Priority,
            category: 'personal' as Category
          },
          {
            title: 'Set budget and priorities',
            description: 'Determine how much to spend and what\'s most important',
            estimatedTime: 15,
            priority: 'high' as Priority,
            category: 'finance' as Category
          },
          {
            title: 'Make purchase',
            description: 'Buy the selected items from chosen retailer',
            estimatedTime: 45,
            priority: 'high' as Priority,
            category: 'personal' as Category
          }
        );
      }
    } else {
      // Generic breakdown
      subtasks.push(
        {
          title: 'Research and preparation',
          description: 'Gather information and prepare necessary resources',
          estimatedTime: 30,
          priority: 'medium' as Priority,
          category: 'work' as Category
        },
        {
          title: 'Execute main task',
          description: 'Complete the primary objective',
          estimatedTime: 60,
          priority: 'high' as Priority,
          category: 'work' as Category
        },
        {
          title: 'Review and refine',
          description: 'Check results and make improvements if needed',
          estimatedTime: 20,
          priority: 'medium' as Priority,
          category: 'work' as Category
        }
      );
    }

    return {
      subtasks,
      totalEstimatedTime: subtasks.reduce((sum, task) => sum + task.estimatedTime, 0)
    };
  }

  // Smart Time Estimation
  async estimateTaskTime(taskTitle: string, taskDescription: string): Promise<TimeEstimation> {
    try {
      if (!this.geminiApiKey) {
        return this.localTimeEstimation(taskTitle, taskDescription);
      }

      const prompt = `
        Estimate how long this task will take to complete. Consider:
        - Task complexity
        - Required skills
        - Potential obstacles
        
        Task: "${taskTitle}"
        Description: "${taskDescription}"
        
        Return as JSON:
        {
          "estimatedMinutes": 45,
          "confidence": "medium",
          "reasoning": "This task involves research and planning, typically takes 30-60 minutes"
        }
      `;

      const response = await axios.post(
        `${GEMINI_API_URL}?key=${this.geminiApiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }
      );

      const result = response.data.candidates[0].content.parts[0].text;
      return JSON.parse(result);
    } catch (error) {
      console.error('AI time estimation failed, using local fallback:', error);
      return this.localTimeEstimation(taskTitle, taskDescription);
    }
  }

  // Local fallback for time estimation
  private localTimeEstimation(taskTitle: string, taskDescription: string): TimeEstimation {
    const text = (taskTitle + ' ' + taskDescription).toLowerCase();
    
    // Simple keyword-based estimation
    if (text.includes('quick') || text.includes('simple') || text.includes('easy')) {
      return {
        estimatedMinutes: 15,
        confidence: 'high',
        reasoning: 'Task appears to be simple and straightforward'
      };
    } else if (text.includes('research') || text.includes('study') || text.includes('learn')) {
      return {
        estimatedMinutes: 60,
        confidence: 'medium',
        reasoning: 'Learning and research tasks typically take 45-90 minutes'
      };
    } else if (text.includes('plan') || text.includes('organize') || text.includes('prepare')) {
      return {
        estimatedMinutes: 45,
        confidence: 'medium',
        reasoning: 'Planning tasks usually require 30-60 minutes'
      };
    } else {
      return {
        estimatedMinutes: 30,
        confidence: 'low',
        reasoning: 'Default estimation based on typical task duration'
      };
    }
  }

  // Natural Language Task Creation
  async parseNaturalLanguage(input: string): Promise<Partial<Task>> {
    try {
      if (!this.geminiApiKey) {
        return this.localNaturalLanguageParse(input);
      }

      const prompt = `
        Parse this natural language task description into structured task data:
        "${input}"
        
        Extract:
        - title (required): A clear, concise task title based on the input
        - description (optional): Brief explanation of what needs to be done
        - priority (low, medium, high, urgent): Based on urgency and importance
        - category (work, personal, health, finance, learning): Most appropriate category
        - due date (if mentioned): ISO date format if date is mentioned, null otherwise
        
        Return ONLY valid JSON without any additional text or explanations:
        {
          "title": "Task title here",
          "description": "Task description here",
          "priority": "medium",
          "category": "personal",
          "dueDate": null
        }
      `;

      const response = await axios.post(
        `${GEMINI_API_URL}?key=${this.geminiApiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }
      );

      const result = response.data.candidates[0].content.parts[0].text;
      
      // Clean the response to extract just the JSON
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        title: parsed.title || input, // Fallback to input if title is missing
        description: parsed.description || '',
        priority: parsed.priority as Priority || 'medium',
        category: parsed.category as Category || 'personal',
        dueDate: parsed.dueDate ? new Date(parsed.dueDate) : undefined
      };
    } catch (error) {
      console.error('AI parsing failed, using local fallback:', error);
      return this.localNaturalLanguageParse(input);
    }
  }

  // Local fallback for natural language parsing
  private localNaturalLanguageParse(input: string): Partial<Task> {
    const lowerInput = input.toLowerCase();
    
    // Extract priority
    let priority: Priority = 'medium';
    if (lowerInput.includes('urgent') || lowerInput.includes('asap')) {
      priority = 'urgent';
    } else if (lowerInput.includes('high priority') || lowerInput.includes('important')) {
      priority = 'high';
    } else if (lowerInput.includes('low priority') || lowerInput.includes('not urgent')) {
      priority = 'low';
    }

    // Extract category
    let category: Category = 'personal';
    if (lowerInput.includes('work') || lowerInput.includes('job') || lowerInput.includes('office')) {
      category = 'work';
    } else if (lowerInput.includes('health') || lowerInput.includes('exercise') || lowerInput.includes('doctor')) {
      category = 'health';
    } else if (lowerInput.includes('money') || lowerInput.includes('finance') || lowerInput.includes('budget')) {
      category = 'finance';
    } else if (lowerInput.includes('learn') || lowerInput.includes('study') || lowerInput.includes('course')) {
      category = 'learning';
    }

    // Extract due date (simple patterns)
    let dueDate: Date | undefined;
    if (lowerInput.includes('today')) {
      dueDate = new Date();
    } else if (lowerInput.includes('tomorrow')) {
      dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    } else if (lowerInput.includes('next week')) {
      dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    // Create a better title for shopping tasks
    let title = input;
    if (lowerInput.includes('buy') || lowerInput.includes('shop') || lowerInput.includes('purchase')) {
      if (lowerInput.includes('phone') && lowerInput.includes('shoes')) {
        title = 'Buy new phone and shoes';
      } else if (lowerInput.includes('phone')) {
        title = 'Buy new phone';
      } else if (lowerInput.includes('shoes')) {
        title = 'Buy new shoes';
      } else {
        title = 'Shopping task';
      }
    }

    return {
      title,
      description: `Task: ${input}`,
      priority,
      category,
      dueDate
    };
  }
}

export const aiService = new AIService();

