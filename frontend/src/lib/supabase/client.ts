// Supabase client placeholder — replace with real credentials later
// This file provides a mock client so the UI works without Supabase

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Mock user type
export interface MockUser {
  id: string;
  email: string;
  full_name: string;
}

// Mock auth functions for UI development
export const mockAuth = {
  signInWithPassword: async (email: string, _password: string) => {
    return {
      user: { id: "mock-user-1", email, full_name: "Demo User" },
      error: null,
    };
  },
  signUp: async (email: string, _password: string, fullName: string) => {
    return {
      user: { id: "mock-user-1", email, full_name: fullName },
      error: null,
    };
  },
  signOut: async () => {
    return { error: null };
  },
  getUser: () => {
    if (typeof window !== "undefined" && localStorage.getItem("genovault_user")) {
      return JSON.parse(localStorage.getItem("genovault_user")!) as MockUser;
    }
    return null;
  },
  setUser: (user: MockUser) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("genovault_user", JSON.stringify(user));
    }
  },
  removeUser: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("genovault_user");
    }
  },
};
