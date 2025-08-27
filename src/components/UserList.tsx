/**
 * UserList Component
 * 
 * This component displays a grid of all users from the Fake Store API.
 * It:
 * - Fetches users from Zustand store on component mount
 * - Displays loading states with skeleton placeholders
 * - Shows error messages with retry functionality
 * - Renders UserCard components in a responsive grid
 * - Handles navigation to individual user details
 * - Provides search and filter functionality
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore, User } from '@/store/userStore';
import { UserCard } from './UserCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * UserList Component
 * 
 * Main component for displaying the list of users
 * Manages local search state and integrates with global user store
 */
export const UserList: React.FC = () => {
  // Get navigation function from React Router
  const navigate = useNavigate();
  
  // Get state and actions from Zustand store
  const { users, loading, error, fetchUsers, clearError } = useUserStore();
  
  // Local state for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  
  // Toast for user feedback
  const { toast } = useToast();

  /**
   * Effect hook to fetch users when component mounts
   * 
   * This runs once when the component is first rendered
   * and fetches all users from the API
   */
  useEffect(() => {
    console.log('🚀 UserList component mounted, fetching users...');
    fetchUsers();
  }, [fetchUsers]);

  /**
   * Effect hook to show error toast when error occurs
   * 
   * This automatically shows a toast notification when an error happens
   */
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    }
  }, [error, toast]);

  /**
   * Handle user card click
   * 
   * Navigates to the user detail page when a user card is clicked
   * Uses React Router for client-side navigation
   */
  const handleUserClick = (user: User) => {
    console.log('🔗 Navigating to user detail:', user.username);
    navigate(`/user/${user.id}`);
  };

  /**
   * Handle retry button click
   * 
   * Clears the error and attempts to fetch users again
   */
  const handleRetry = () => {
    console.log('🔄 Retrying user fetch...');
    clearError();
    fetchUsers();
  };

  /**
   * Filter users based on search term
   * 
   * Searches through username, email, and full name
   * Case-insensitive search
   */
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${user.name.firstname} ${user.name.lastname}`.toLowerCase();
    
    return (
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      fullName.includes(searchLower)
    );
  });

  /**
   * Loading Skeleton Component
   * 
   * Shows placeholder cards while data is loading
   * Provides better UX than empty screen
   */
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            User Directory
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse and manage users from the Fake Store API. 
          Click on any user card to view detailed information.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users by name, username, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border-border/50 focus:border-primary"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Found {filteredUsers.length} user(s) matching "{searchTerm}"
          </p>
        )}
      </div>

      {/* Error State */}
      {error && (
        <Alert className="mb-8 border-destructive/20 bg-destructive/5">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                className="ml-4 border-destructive/20 text-destructive hover:bg-destructive/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && <LoadingSkeleton />}

      {/* Users Grid */}
      {!loading && !error && (
        <>
          {filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onClick={handleUserClick}
                  className="h-full"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="p-4 rounded-full bg-muted/50 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No users found
                </h3>
                <p className="text-muted-foreground mb-6">
                  No users match your search criteria. Try adjusting your search terms.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Stats Footer */}
      {!loading && !error && users.length > 0 && (
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-card border border-border/50 rounded-lg">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{users.length}</span> total users
            </div>
            <div className="w-px h-4 bg-border"></div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{filteredUsers.length}</span> displayed
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;