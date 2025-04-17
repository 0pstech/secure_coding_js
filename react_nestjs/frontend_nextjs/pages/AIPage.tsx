import React from 'react';
import { AIPrompt } from '../components/AIPrompt';
import { useAuth } from '../contexts/AuthContext';

export const AIPage: React.FC = () => {
  const { user } = useAuth();
  // Hardcoded API key (for demonstration purposes only)
  const apiKey = 'your-api-key-here';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="py-12 bg-gradient-to-r from-indigo-600 to-blue-500">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              AI Chat Assistant
            </h1>
            <p className="mt-3 max-w-md mx-auto text-lg text-indigo-100 sm:text-xl md:mt-5 md:max-w-3xl">
              Welcome back, {user?.username || 'User'}!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-gradient-to-b from-gray-50 to-white text-lg font-medium text-gray-900">
              Ask anything
            </span>
          </div>
        </div>

        <div className="mt-8">
          <AIPrompt apiKey={apiKey} />
        </div>

        {/* User Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Logged in as {user?.username} | {user?.email}
        </div>
      </div>
    </div>
  );
}; 