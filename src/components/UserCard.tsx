/**
 * UserCard Component
 * 
 * A reusable card component that displays individual user information.
 * This component:
 * - Takes a user object as prop
 * - Displays key user information (username, email, name)
 * - Provides click interaction to view full user details
 * - Uses our design system for consistent styling
 * - Includes hover effects and animations for better UX
 */

import React from 'react';
import { User } from '@/store/userStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User as UserIcon, Mail, MapPin, Phone } from 'lucide-react';

interface UserCardProps {
  user: User;                    // User data to display
  onClick?: (user: User) => void; // Optional click handler for navigation
  className?: string;            // Optional additional CSS classes
}

/**
 * UserCard Component
 * 
 * This component renders a beautiful card for each user with:
 * - User's profile information
 * - Interactive hover effects
 * - Click handling for navigation
 * - Responsive design
 * - Semantic color usage from our design system
 */
export const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  onClick, 
  className = '' 
}) => {
  
  /**
   * Handle card click
   * 
   * Calls the optional onClick prop with the user data
   * This allows parent components to handle navigation or other actions
   */
  const handleClick = () => {
    if (onClick) {
      console.log('🔗 UserCard clicked for user:', user.username);
      onClick(user);
    }
  };

  /**
   * Format user's full name
   * 
   * Combines firstname and lastname with proper capitalization
   */
  const fullName = `${user.name.firstname} ${user.name.lastname}`;
  
  /**
   * Format user's address for display
   * 
   * Creates a readable address string from the address object
   */
  const addressDisplay = `${user.address.city}, ${user.address.zipcode}`;

  return (
    <Card 
      className={`
        transition-custom cursor-pointer group
        hover:shadow-xl hover:scale-[1.02] hover:bg-card-hover
        border border-border/50 hover:border-primary/20
        animate-fade-in
        ${className}
      `}
      onClick={handleClick}
    >
      {/* Card Header with User Icon and Basic Info */}
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {/* User Avatar Circle */}
          <div className="
            w-12 h-12 rounded-full 
            bg-primary/10 
            flex items-center justify-center 
            border-2 border-primary/20
            group-hover:border-primary/40 
            transition-custom
          ">
            <UserIcon className="w-6 h-6 text-primary" />
          </div>
          
          {/* User Name and Username */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-lg mb-1 truncate">
              {fullName}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs font-medium">
                @{user.username}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Card Content with Contact Information */}
      <CardContent className="pt-0 space-y-3">
        {/* Email Address */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="w-4 h-4 text-accent" />
          <span className="truncate">{user.email}</span>
        </div>

        {/* Phone Number */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="w-4 h-4 text-success" />
          <span>{user.phone}</span>
        </div>

        {/* Address */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-warning" />
          <span className="truncate">{addressDisplay}</span>
        </div>

        {/* User ID Badge */}
        <div className="pt-2 border-t border-border/30">
          <Badge variant="outline" className="text-xs">
            ID: {user.id}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;