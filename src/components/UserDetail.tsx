/**
 * UserDetail Component
 * 
 * This component displays detailed information for a single user.
 * It:
 * - Receives user ID from URL parameters using React Router
 * - Fetches user data from Zustand store or API if not in store
 * - Displays comprehensive user information in an organized layout
 * - Provides navigation back to user list
 * - Shows loading states and error handling
 * - Uses our design system for consistent, beautiful styling
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Home,
  Globe,
  AlertCircle,
  RefreshCw 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * UserDetail Component
 * 
 * Shows detailed view of a single user with all available information
 * from the Fake Store API organized in a beautiful, responsive layout
 */
export const UserDetail: React.FC = () => {
  // Get URL parameters (user ID) from React Router
  const { id } = useParams<{ id: string }>();
  
  // Get navigation function for going back
  const navigate = useNavigate();
  
  // Get state and actions from Zustand store
  const { selectedUser, loading, error, fetchUserById, clearError } = useUserStore();
  
  // Toast for user feedback
  const { toast } = useToast();

  /**
   * Effect hook to fetch user data when component mounts or ID changes
   * 
   * This runs when:
   * - Component first mounts
   * - User ID in URL changes
   * - fetchUserById function changes (shouldn't happen often)
   */
  useEffect(() => {
    if (id) {
      const userId = parseInt(id, 10);
      if (!isNaN(userId)) {
        console.log('🔍 UserDetail mounted, fetching user ID:', userId);
        fetchUserById(userId);
      } else {
        console.error('❌ Invalid user ID in URL:', id);
        toast({
          variant: "destructive",
          title: "Invalid User ID",
          description: "The user ID in the URL is not valid.",
        });
      }
    }
  }, [id, fetchUserById]);

  /**
   * Effect hook to show error toast when error occurs
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
   * Handle back button click
   * 
   * Navigates back to the user list page
   */
  const handleGoBack = () => {
    console.log('⬅️ Navigating back to user list');
    navigate('/');
  };

  /**
   * Handle retry button click
   * 
   * Clears error and attempts to fetch user again
   */
  const handleRetry = () => {
    if (id) {
      const userId = parseInt(id, 10);
      console.log('🔄 Retrying user fetch for ID:', userId);
      clearError();
      fetchUserById(userId);
    }
  };

  /**
   * Loading Skeleton Component
   * 
   * Shows placeholder content while data is loading
   */
  const LoadingSkeleton = () => (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Skeleton className="h-10 w-32" />
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Show loading skeleton while fetching data
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Show error state if there's an error and no user data
  if (error && !selectedUser) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="mb-6 hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </Button>
        
        <Alert className="border-destructive/20 bg-destructive/5">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium mb-1">Unable to load user details</p>
                <p>{error}</p>
              </div>
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
      </div>
    );
  }

  // Show message if no user is selected/found
  if (!selectedUser) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="mb-6 hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </Button>
        
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            User not found
          </h2>
          <p className="text-muted-foreground">
            The requested user could not be found.
          </p>
        </div>
      </div>
    );
  }

  // Format user's full name
  const fullName = `${selectedUser.name.firstname} ${selectedUser.name.lastname}`;
  
  // Format full address
  const fullAddress = `${selectedUser.address.number} ${selectedUser.address.street}, ${selectedUser.address.city}, ${selectedUser.address.zipcode}`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={handleGoBack}
        className="mb-6 hover:bg-secondary transition-custom"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Users
      </Button>

      {/* Main User Detail Card */}
      <Card className="animate-fade-in shadow-xl border border-border/50">
        {/* User Header */}
        <CardHeader className="gradient-card border-b border-border/30">
          <div className="flex items-start gap-6">
            {/* User Avatar */}
            <div className="
              w-20 h-20 rounded-full 
              bg-primary/10 
              flex items-center justify-center 
              border-4 border-primary/20
              shadow-lg
            ">
              <UserIcon className="w-10 h-10 text-primary" />
            </div>
            
            {/* User Basic Info */}
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold text-foreground mb-2">
                {fullName}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="default" className="px-3 py-1">
                  @{selectedUser.username}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  ID: {selectedUser.id}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Contact Information Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-accent" />
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Email Address
                </label>
                <div className="flex items-center gap-3 p-3 bg-card border border-border/30 rounded-lg">
                  <Mail className="w-4 h-4 text-accent" />
                  <span className="text-foreground">{selectedUser.email}</span>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Phone Number
                </label>
                <div className="flex items-center gap-3 p-3 bg-card border border-border/30 rounded-lg">
                  <Phone className="w-4 h-4 text-success" />
                  <span className="text-foreground">{selectedUser.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Address Information Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-warning" />
              Address Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Address */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Street Address
                </label>
                <div className="flex items-start gap-3 p-3 bg-card border border-border/30 rounded-lg">
                  <Home className="w-4 h-4 text-warning mt-1" />
                  <span className="text-foreground">{fullAddress}</span>
                </div>
              </div>

              {/* Location Coordinates */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Coordinates
                </label>
                <div className="flex items-center gap-3 p-3 bg-card border border-border/30 rounded-lg">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="text-foreground text-sm">
                    {selectedUser.address.geolocation.lat}, {selectedUser.address.geolocation.long}
                  </span>
                </div>
              </div>
            </div>

            {/* Address Components */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">City</p>
                <p className="font-medium text-foreground">{selectedUser.address.city}</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Street</p>
                <p className="font-medium text-foreground">{selectedUser.address.street}</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Number</p>
                <p className="font-medium text-foreground">{selectedUser.address.number}</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Zipcode</p>
                <p className="font-medium text-foreground">{selectedUser.address.zipcode}</p>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Account Information Section */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" />
              Account Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name Breakdown */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    First Name
                  </label>
                  <div className="p-3 bg-card border border-border/30 rounded-lg">
                    <span className="text-foreground font-medium">{selectedUser.name.firstname}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Last Name
                  </label>
                  <div className="p-3 bg-card border border-border/30 rounded-lg">
                    <span className="text-foreground font-medium">{selectedUser.name.lastname}</span>
                  </div>
                </div>
              </div>

              {/* Account Security */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Username
                  </label>
                  <div className="p-3 bg-card border border-border/30 rounded-lg">
                    <span className="text-foreground font-medium">@{selectedUser.username}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Password
                  </label>
                  <div className="p-3 bg-card border border-border/30 rounded-lg">
                    <span className="text-muted-foreground text-sm">••••••••</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetail;