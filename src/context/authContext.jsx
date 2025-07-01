"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { checkAuthStatus, loginUser, logoutUser, registerUser } from '@/helper/auth';
import Cookies from "js-cookie";
import {
  useAuthStore,
  useUser,
  useIsLoggedIn,
  useIsAuthLoading,
  useAuthActions,
} from '@/redux/authstore'; // lowercase 's'


const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { user, isLoggedIn, isLoading } = useAuthStore();
  const { setUser, setIsLoggedIn, setIsLoading } = useAuthActions();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = Cookies.get("store-auth-token");
        if (token) {
          const data = await checkAuthStatus(token);
          setUser(data.user);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setIsLoggedIn, setIsLoading]);

  const login = async (email, password) => {
    try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Login failed with status ${response.status}`);
        }

        if (data && data._id) {
            // Optionally set a token if your backend returns one
            // Cookies.set("store-auth-token", data.token);
            setUser(data);
            setIsLoggedIn(true);
            return { status: "ok", user: data };
        } else {
            throw new Error(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    } finally {
        setIsLoading(false);
    }
};




/////////////////////////////////////////////////////////////////////////////////
const register = async (data) => {
  try {
    setIsLoading(true);
    const res = await registerUser(data);
    console.log("📦 Response from registerUser:", res);

    // Updated success condition - checks both formats
    if (res.status === "ok" || res.user) {
      // Get the user object from either format
      const user = res.user || res;
      
      // Set auth token if available
      if (user.token) {
        Cookies.set("store-auth-token", user.token);
      }
      
      // Update auth state
      setUser(user);
      setIsLoggedIn(true);
      
      // Return consistent success format
      return { 
        status: "ok", 
        user: user,
        message: res.message || "Registration successful"
      };
    }
    
    // Handle API error responses (maintain existing format)
    return { 
      status: "bad", 
      message: res.message || "Registration failed",
      field: res.field,
      code: res.code
    };
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle HTTP errors (maintain existing format)
    if (error.response?.data) {
      return {
        status: "bad",
        ...error.response.data, // Spread all error data
        message: error.response.data.message || "Registration error"
      };
    }
    
    // Maintain network error format
    return { 
      status: "bad",
      message: "Network error. Please try again.",
      code: "NETWORK_ERROR"
    };
  } finally {
    setIsLoading(false);
  }
};

const logout = async () => {
  await logoutUser();
  Cookies.remove("store-auth-token");
  setIsLoggedIn(false);
  setUser(null);
  window.location.reload();
};

const value = { user, isLoggedIn, isLoading, login, logout, register };

return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
);
};

export const useAuth = () => {
const context = useContext(AuthContext);
if (!context) {
  console.error("AuthContext is null. Check if AuthProvider is properly wrapping your app.");
  throw new Error("useAuth must be used within an AuthProvider");
}
return context;
};
