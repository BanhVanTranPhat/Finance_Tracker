import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api.js";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          // First, set user from localStorage immediately for better UX
          const userData = JSON.parse(storedUser);
          setUser(userData);

          // Then verify token with backend in background
          try {
            const response = await authAPI.getCurrentUser();
            setUser(response.user);
          } catch {
            // Token is invalid, clear storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        } catch {
          // Invalid user data, clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();

    // Listen for Google OAuth success
    const handleGoogleAuthSuccess = (e) => {
      console.log("🎉 Received googleAuthSuccess event:", e.detail);
      const { user, token } = e.detail;
      setUser(user);
      setIsLoading(false);
      console.log("✅ AuthContext updated with user:", user);
    };

    // Listen for storage changes (for other OAuth flows)
    const handleStorageChange = (e) => {
      console.log("📦 Storage event received:", e.key, e.newValue);
      if (e.key === "token" || e.key === "user") {
        // Immediately update user state from localStorage for Google OAuth
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            console.log("🔄 Updating user from storage:", userData);
            setUser(userData);
            setIsLoading(false);
          } catch {
            // Invalid user data, clear storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener("googleAuthSuccess", handleGoogleAuthSuccess);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("googleAuthSuccess", handleGoogleAuthSuccess);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);

      const userData = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
      };

      setUser(userData);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(userData));
      if (!localStorage.getItem("onboarding_completed")) {
        localStorage.setItem("onboarding_completed", "false");
      }
    } catch (error) {
      const err = error;
      // cspell:disable-next-line
      throw new Error(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  const register = async (email, password, name) => {
    try {
      const response = await authAPI.register(name, email, password);

      const userData = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
      };

      setUser(userData);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(userData));
      if (!localStorage.getItem("onboarding_completed")) {
        localStorage.setItem("onboarding_completed", "false");
      }
    } catch (error) {
      const err = error;
      // cspell:disable-next-line
      throw new Error(err.response?.data?.message || "Đăng ký thất bại");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
