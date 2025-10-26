import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api.js";

const AuthContext = createContext(undefined);

// Helper function to clear all financial data
const clearFinancialData = () => {
  localStorage.removeItem("financial_goals");
  localStorage.removeItem("wallets");
  localStorage.removeItem("categories");
  localStorage.removeItem("transactions");
};

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
          console.log("🔄 InitAuth - user set from localStorage:", userData);

          // Then verify token with backend in background
          try {
            const response = await authAPI.getCurrentUser();
            setUser(response.user);
            console.log(
              "✅ InitAuth - user verified with backend:",
              response.user
            );
          } catch {
            // Token is invalid, clear storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            console.log("❌ InitAuth - token invalid, cleared storage");
          }
        } catch {
          // Invalid user data, clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          console.log("❌ InitAuth - invalid user data, cleared storage");
        }
      }
      setIsLoading(false);
      console.log("✅ InitAuth - isLoading set to false");
    };

    initAuth();

    // Listen for Google OAuth success
    const handleGoogleAuthSuccess = (e) => {
      console.log(
        "🎉 Received googleAuthSuccess event:",
        e.detail,
        "at",
        new Date().toISOString()
      );
      const { user, token } = e.detail;
      console.log("🔄 Setting user and isLoading:", { user, isLoading: false });
      setUser(user);
      setIsLoading(false);

      // Clear any existing financial data for new user
      clearFinancialData();

      // Set a flag to indicate this is a Google OAuth login
      localStorage.setItem("google_oauth_login", "true");

      console.log(
        "✅ AuthContext updated with user:",
        user,
        "isLoading: false"
      );

      // Force a re-render by dispatching a custom event for Google OAuth
      // Always dispatch to ensure proper layout detection
      setTimeout(() => {
        console.log(
          "🔄 Dispatching forceUpdate event for ResponsiveLayout (Google OAuth)"
        );
        window.dispatchEvent(new CustomEvent("forceResponsiveUpdate"));
      }, 100);
    };

    // Listen for storage changes (for other OAuth flows)
    const handleStorageChange = (e) => {
      console.log("📦 Storage event received:", e.key, e.newValue);
      if (e.key === "token" || e.key === "user") {
        // Immediately update user state from localStorage for Google OAuth
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const isGoogleOAuth =
          localStorage.getItem("google_oauth_login") === "true";

        if (token && storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            console.log(
              "🔄 Updating user from storage:",
              userData,
              "isGoogleOAuth:",
              isGoogleOAuth
            );
            setUser(userData);
            setIsLoading(false);

            // If this is Google OAuth, dispatch force update event
            if (isGoogleOAuth) {
              console.log(
                "🔄 Google OAuth detected in storage change, dispatching forceResponsiveUpdate"
              );
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent("forceResponsiveUpdate"));
              }, 100);
            }

            console.log("✅ Storage change - user set, isLoading: false");
          } catch {
            // Invalid user data, clear storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            console.log("❌ Invalid user data, cleared storage");
          }
        } else {
          // Only clear user if we don't have credentials and it's not an onboarding completion
          const onboardingCompleted =
            localStorage.getItem("onboarding_completed") === "true";
          if (!onboardingCompleted) {
            console.log("❌ No credentials found in storage, clearing user");
            setUser(null);
          } else {
            console.log("📋 Onboarding completed, keeping user state");
          }
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

      // Only set onboarding_completed to false if it doesn't exist (first time login)
      const existingOnboardingStatus = localStorage.getItem(
        "onboarding_completed"
      );
      console.log(
        "🔍 Login - existing onboarding status:",
        existingOnboardingStatus
      );

      if (!existingOnboardingStatus) {
        localStorage.setItem("onboarding_completed", "false");
        console.log(
          "🔄 Set onboarding_completed to false for first-time login"
        );
        // Clear any existing financial data for first-time login
        clearFinancialData();
      } else {
        console.log(
          "✅ Keep existing onboarding status:",
          existingOnboardingStatus
        );
      }
      // If onboarding_completed already exists, don't change it
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
      localStorage.setItem("onboarding_completed", "false");

      // Clear any existing financial data for new user
      clearFinancialData();
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
    // Don't clear onboarding_completed - keep it for next login
    // localStorage.removeItem("onboarding_completed");
    // Clear all financial data
    clearFinancialData();
  };

  const updateUserProfile = (profileData) => {
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        updateUserProfile,
        isLoading,
      }}
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
