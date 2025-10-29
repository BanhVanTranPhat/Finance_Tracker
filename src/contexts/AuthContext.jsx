import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api.js";

const AuthContext = createContext(undefined);

// Helper function to clear all financial data
const clearFinancialData = () => {
  console.log("🧹 Clearing all financial data from localStorage");
  localStorage.removeItem("financial_goals");
  localStorage.removeItem("wallets");
  localStorage.removeItem("categories");
  localStorage.removeItem("transactions");
  localStorage.removeItem("selected_wallet");
  localStorage.removeItem("selected_category");
  localStorage.removeItem("budget_data");
  localStorage.removeItem("analytics_data");
  localStorage.removeItem("user_preferences");
  localStorage.removeItem("google_oauth_login");
  localStorage.removeItem("data_manually_cleared");
  console.log("✅ All financial data cleared");
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

          // Then verify token with backend in background
          try {
            const response = await authAPI.getCurrentUser();
            setUser(response.user);
          } catch {
            // Token is invalid, clear storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            // token invalid
          }
        } catch {
          // Invalid user data, clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          // invalid user data
        }
      }
      setIsLoading(false);
      // done init
    };

    initAuth();

    // Listen for Google OAuth success
    const handleGoogleAuthSuccess = (e) => {
      const { user, token } = e.detail;
      setUser(user);
      setIsLoading(false);

      // Clear any existing financial data for new user
      clearFinancialData();

      // Set a flag to indicate this is a Google OAuth login
      localStorage.setItem("google_oauth_login", "true");

      // Force a re-render by dispatching a custom event for Google OAuth
      // Always dispatch to ensure proper layout detection
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("forceResponsiveUpdate"));
      }, 100);
    };

    // Listen for storage changes (for other OAuth flows)
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "user") {
        // Immediately update user state from localStorage for Google OAuth
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const isGoogleOAuth =
          localStorage.getItem("google_oauth_login") === "true";

        if (token && storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            // Defer state updates to avoid setState during another tree render
            setTimeout(() => {
              setUser(userData);
              setIsLoading(false);
            }, 0);

            // If this is Google OAuth, dispatch force update event
            if (isGoogleOAuth) {
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent("forceResponsiveUpdate"));
              }, 100);
            }
          } catch {
            // Invalid user data, clear storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        } else {
          // Only clear user if we don't have credentials and it's not an onboarding completion
          const onboardingCompleted =
            localStorage.getItem("onboarding_completed") === "true";
          if (!onboardingCompleted) {
            setUser(null);
          } else {
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

      // Ensure onboarding flag is correct per user
      const existingOnboardingStatus = localStorage.getItem(
        "onboarding_completed"
      );
      const previousUserRaw = localStorage.getItem("user");
      const previousUserId = previousUserRaw
        ? JSON.parse(previousUserRaw).id
        : null;
      const isDifferentUser = previousUserId && previousUserId !== userData.id;

      if (!existingOnboardingStatus || isDifferentUser) {
        // New browser or different user: reset onboarding and clear cached finance data
        localStorage.setItem("onboarding_completed", "false");
        clearFinancialData();
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
