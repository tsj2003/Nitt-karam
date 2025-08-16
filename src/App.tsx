import React, { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import TaskList from './components/Task/TaskList';
import AIInsights from './components/Task/AIInsights';
import { TaskProvider } from './context/TaskContext';
import { useDarkMode } from './utils/useDarkMode';

function App() {
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      </div>
      
      <TaskProvider>
        <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        
        <main className="relative pt-40 pb-16">
          <div className="container mx-auto px-6">
            {isLoading ? (
              <div className="flex justify-center items-center p-16">
                <div className="glass p-8 rounded-3xl text-center">
                  <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-6 mx-auto"></div>
                  <p className="text-white/80 text-lg font-medium">Loading your tasks...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <TaskList />
                </div>
                <div className="lg:col-span-1">
                  <AIInsights />
                </div>
              </div>
            )}
          </div>
        </main>
        
        <footer className="relative glass py-8 mt-16">
          <div className="container mx-auto px-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-2xl mr-4 shadow-lg">
                <img 
                  src="/image.png" 
                  alt="Khanda - Sikh Symbol"
                  className="h-8 w-8"
                />
              </div>
              <span className="text-2xl font-bold text-white">Nitt Karam</span>
            </div>
            <p className="text-white/60 text-sm">
              &copy; {new Date().getFullYear()} - AI-Powered Task Management System
            </p>
          </div>
        </footer>
      </TaskProvider>
    </div>
  );
}

export default App;