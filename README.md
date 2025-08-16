# 🤖 Nitt Karam - AI-Enhanced Task Management System

A modern, intelligent task management application built with React, TypeScript, and AI integration. Nitt Karam helps you break down complex projects, estimate task durations, and get smart productivity insights.

## ✨ Features

### 🎯 Core Task Management
- **Create, edit, and delete tasks** with rich metadata
- **Priority levels**: Low, Medium, High, Urgent
- **Categories**: Work, Personal, Health, Finance, Learning
- **Due dates and dependencies** between tasks
- **Dark/Light mode** toggle
- **Local storage** persistence

### 🤖 AI-Powered Features

#### 1. **Natural Language Task Creation**
- Type tasks in plain English: *"Buy groceries tomorrow with high priority"*
- AI automatically extracts title, priority, category, and due date
- Works with free Gemini API or local fallback logic

#### 2. **AI Task Breakdown**
- Break complex projects into actionable subtasks
- AI suggests realistic time estimates for each subtask
- Automatically categorizes and prioritizes subtasks
- Create entire project workflows with one click

#### 3. **Smart Time Estimation**
- Get AI-powered time estimates for any task
- Considers task complexity and requirements
- Provides confidence levels and reasoning

#### 4. **AI Insights & Analytics**
- **Productivity tracking**: Completion rates and trends
- **Time management**: Average task duration analysis
- **Priority distribution**: Smart recommendations
- **Category balance**: Work-life balance insights
- **Smart alerts**: Urgent and overdue task warnings
- **Personalized tips**: AI-generated productivity advice

### 🏗️ Advanced Data Structures
- **Priority Queue**: Efficient task prioritization
- **Linked List**: Sequential task dependencies
- **Binary Search**: Fast task lookup and filtering
- **Search Algorithms**: Optimized task discovery

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd Nitt-Karam

# Install dependencies
npm install

# Start development server
npm run dev
```

### AI API Setup (Optional)
For enhanced AI features, get free API keys:

1. **Google Gemini API** (Recommended)
   - Visit: https://makersuite.google.com/app/apikey
   - Get a free API key
   - Add it in the app's AI Settings

2. **Hugging Face** (Optional)
   - Visit: https://huggingface.co/settings/tokens
   - Get a free token for additional models

## 🎮 How to Use

### Creating Tasks
1. **Regular Task**: Click "Add Task" for manual creation
2. **AI Task**: Click "AI Task" for AI-enhanced creation

### Natural Language Input
Try these examples:
- *"Plan a wedding next month"*
- *"Study React hooks with high priority"*
- *"Buy groceries tomorrow"*
- *"Complete project report by Friday"*

### AI Task Breakdown
1. Create a complex task like "Plan a wedding"
2. Click "AI Features" → "Break Down Task"
3. Review AI-generated subtasks
4. Click "Create All Subtasks" to add them to your list

### Smart Insights
- View real-time productivity analytics
- Get personalized recommendations
- Monitor task completion patterns
- Receive smart alerts for urgent tasks

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: Google Gemini API + Hugging Face
- **Data Structures**: Custom implementations
- **State Management**: React Context API

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   └── Header.tsx
│   ├── Task/
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskForm.tsx
│   │   ├── AITaskForm.tsx      # AI-enhanced form
│   │   ├── AIInsights.tsx      # Analytics dashboard
│   │   └── TaskFilters.tsx
│   └── UI/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Badge.tsx
│       └── Spinner.tsx
├── context/
│   └── TaskContext.tsx
├── data-structures/
│   ├── priority-queue.ts
│   ├── linked-list.ts
│   └── search-algorithms.ts
├── utils/
│   ├── aiService.ts           # AI integration
│   └── useDarkMode.ts
└── types/
    └── task.ts
```

## 🎯 Real-World Problem Solving

This application solves several common productivity challenges:

### 1. **Project Overwhelm**
- **Problem**: Complex projects feel overwhelming
- **Solution**: AI breaks down large tasks into manageable steps

### 2. **Poor Time Estimation**
- **Problem**: People underestimate task duration
- **Solution**: AI provides realistic time estimates

### 3. **Task Prioritization**
- **Problem**: Difficulty deciding what to do first
- **Solution**: Smart priority suggestions and insights

### 4. **Productivity Blind Spots**
- **Problem**: No visibility into work patterns
- **Solution**: AI analytics reveal productivity insights

### 5. **Work-Life Balance**
- **Problem**: Imbalanced focus across life areas
- **Solution**: Category balance analysis and recommendations

## 🔧 Customization

### Adding New AI Features
1. Extend `aiService.ts` with new AI functions
2. Add UI components in `components/Task/`
3. Integrate with existing task context

### Custom Data Structures
- Implement new algorithms in `data-structures/`
- Add to task context for integration
- Create visualization components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- Hugging Face for additional AI models
- Lucide for beautiful icons
- Tailwind CSS for styling

---

**Built with ❤️ and AI to make task management smarter and more productive!**

