/**
 * Zustand Store for User Management
 * 
 * This store manages the global state for user data in our fake store application.
 * It provides centralized state management for:
 * - User list data from the Fake Store API
 * - Loading states for better UX
 * - Error handling for API failures
 * - CRUD operations (Create, Read, Update, Delete)
 */

import { create } from 'zustand';
import axios from 'axios';

// Define the User interface based on Fake Store API response
export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: {
      lat: string;
      long: string;
    };
  };
  phone: string;
}

// Define the store state interface
interface UserState {
  // State properties
  users: User[];           // Array to store all users
  loading: boolean;        // Loading state for API calls
  error: string | null;    // Error message for failed operations
  selectedUser: User | null; // Currently selected user for detailed view

  // Action functions
  fetchUsers: () => Promise<void>;           // Fetch all users from API
  fetchUserById: (id: number) => Promise<void>; // Fetch single user by ID
  clearError: () => void;                    // Clear error state
  setSelectedUser: (user: User | null) => void; // Set selected user for detail view
}

// Base API URL for Fake Store API
const API_BASE_URL = 'https://fakestoreapi.com';

/**
 * User Store using Zustand
 * 
 * This creates a global store that components can subscribe to.
 * The store automatically triggers re-renders when state changes.
 */
export const useUserStore = create<UserState>((set, get) => ({
  // Initial state
  users: [],
  loading: false,
  error: null,
  selectedUser: null,

  /**
   * Fetch all users from the Fake Store API
   * 
   * This function:
   * 1. Sets loading to true
   * 2. Makes API call to get all users
   * 3. Updates users array with response data
   * 4. Handles errors appropriately
   * 5. Sets loading to false when complete
   */
  fetchUsers: async () => {
    set({ loading: true, error: null });
    
    try {
      console.log('🔍 Fetching users from Fake Store API...');
      const response = await axios.get(`${API_BASE_URL}/users`);
      
      console.log('✅ Users fetched successfully:', response.data.length, 'users');
      set({ 
        users: response.data, 
        loading: false,
        error: null 
      });
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      set({ 
        loading: false, 
        error: 'Failed to fetch users. Please try again.' 
      });
    }
  },

  /**
   * Fetch a single user by ID
   * 
   * This function:
   * 1. First checks if user exists in current users array (for efficiency)
   * 2. If not found, makes API call to get specific user
   * 3. Sets the user as selectedUser for detailed view
   * 4. Handles errors appropriately
   */
  fetchUserById: async (id: number) => {
    set({ loading: true, error: null });

    try {
      // First check if user is already in our users array
      const existingUser = get().users.find(user => user.id === id);
      
      if (existingUser) {
        console.log('👤 User found in store cache:', existingUser.username);
        set({ 
          selectedUser: existingUser, 
          loading: false 
        });
        return;
      }

      // If not found in store, fetch from API
      console.log('🔍 Fetching user by ID from API:', id);
      const response = await axios.get(`${API_BASE_URL}/users/${id}`);
      
      console.log('✅ User fetched successfully:', response.data.username);
      set({ 
        selectedUser: response.data, 
        loading: false,
        error: null 
      });
    } catch (error) {
      console.error('❌ Error fetching user by ID:', error);
      set({ 
        loading: false, 
        error: `Failed to fetch user with ID ${id}. Please try again.`,
        selectedUser: null 
      });
    }
  },

  /**
   * Clear error state
   * 
   * Used to reset error messages after user acknowledgment
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Set selected user for detail view
   * 
   * This allows components to set a user for detailed viewing
   * without making an API call
   */
  setSelectedUser: (user: User | null) => {
    set({ selectedUser: user });
  }
}));