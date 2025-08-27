/**
 * UserDetailPage
 * 
 * This is the page component that wraps the UserDetail component.
 * It serves as the route endpoint for individual user details.
 * 
 * Route: /user/:id
 * Purpose: Display detailed information for a specific user
 */

import React from 'react';
import { UserDetail } from '@/components/UserDetail';

/**
 * UserDetailPage Component
 * 
 * Simple wrapper page that renders the UserDetail component
 * This follows the pattern of separating page components from business logic components
 */
const UserDetailPage: React.FC = () => {
  return <UserDetail />;
};

export default UserDetailPage;