/**
 * Index Page - Main Landing Page
 * 
 * This is the main page of our Fake Store User Management application.
 * It displays the user list and serves as the entry point for the app.
 * 
 * Features:
 * - Hero section with branding
 * - User list display using UserList component
 * - Responsive design with beautiful styling
 * - Integration with Zustand store for state management
 */

import React from 'react';
import { UserList } from '@/components/UserList';
import heroImage from '@/assets/hero-banner.jpg';

/**
 * Index Component
 * 
 * Main landing page that combines a hero section with the user list
 * Uses our design system for consistent, beautiful styling
 */
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        {/* Hero Gradient Overlay */}
        <div className="absolute inset-0 gradient-hero opacity-90" />
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              Fake Store
              <span className="block text-accent mt-2">User Management</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Explore and manage users from the Fake Store API with our modern, 
              responsive interface built with React and Zustand.
            </p>
            
            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium">
                🚀 React + TypeScript
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium">
                🎯 Zustand State Management
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium">
                🎨 Modern Design System
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium">
                📱 Fully Responsive
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User List Section */}
      <section className="relative z-20 -mt-8">
        <UserList />
      </section>
    </div>
  );
};

export default Index;
