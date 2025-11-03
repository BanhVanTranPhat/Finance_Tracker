import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI, setInitializingAuth } from "../services/api.js";

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
      // Set flag to prevent interceptor from clearing token during init
      setInitializingAuth(true);
      
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          // First, set user from localStorage immediately for better UX
          // This ensures user stays logged in even if verification fails temporarily
          const userData = JSON.parse(storedUser);
          setUser(userData);

          // Then verify token with backend in background
          // If verification fails, keep the user logged in (might be network issue)
          // Only clear on explicit logout or if token is clearly invalid
          try {
            const response = await authAPI.getCurrentUser();
            // Update user data if verification succeeds
            if (response.user) {
              setUser(response.user);
              // Update localStorage with latest user data
              localStorage.setItem("user", JSON.stringify(response.user));
            }
          } catch (error) {
            // Don't clear token immediately on verification failure
            // Could be network issue, server down, or temporary problem
            // Keep user logged in with cached data
            console.warn("⚠️ Token verification failed, keeping cached session:", error.message);
            // Only clear if error is explicitly "unauthorized" or "token invalid"
            // But wait a bit and retry once to avoid false positives
            if (error.response?.status === 401 || error.response?.status === 403) {
              // Retry once after a short delay
              try {
                await new Promise(resolve => setTimeout(resolve, 500));
                const retryResponse = await authAPI.getCurrentUser();
                if (retryResponse.user) {
                  setUser(retryResponse.user);
                  localStorage.setItem("user", JSON.stringify(retryResponse.user));
                  console.log("✅ Retry successful, token is valid");
                }
              } catch (retryError) {
                // Retry also failed, token is likely invalid
                console.log("🚫 Token is invalid after retry, clearing session");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
              }
            }
            // For other errors (network, 500, etc.), keep user logged in
          }
        } catch (parseError) {
          // Invalid user data in localStorage, clear it
          console.error("❌ Invalid user data in localStorage:", parseError);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      
      // Clear flag after init is complete
      setInitializingAuth(false);
      setIsLoading(false);
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
        avatar: response.user.avatar || "",
      };

      // Get previous user BEFORE setting new user data
      const previousUserRaw = localStorage.getItem("user");
      const previousUserId = previousUserRaw
        ? JSON.parse(previousUserRaw).id
        : null;
      const isDifferentUser = previousUserId && previousUserId !== userData.id;

      setUser(userData);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Ensure onboarding flag is correct per user
      const existingOnboardingStatus = localStorage.getItem(
        "onboarding_completed"
      );

      // Only reset onboarding if:
      // 1. No onboarding status exists (first time), OR
      // 2. Different user is logging in
      if (!existingOnboardingStatus || isDifferentUser) {
        // New browser or different user: reset onboarding and clear cached finance data
        localStorage.setItem("onboarding_completed", "false");
        
        // Reset tour flags for new/different user
        const userKey = userData.id || userData.email || "guest";
        localStorage.removeItem(`tour_seen_once_${userKey}`);
        localStorage.removeItem("tour_dismissed");
        
        console.log("✅ User logged in - onboarding_completed set to false (new/different user)");
        clearFinancialData();
      } else {
        console.log("✅ User logged in - keeping existing onboarding status:", existingOnboardingStatus);
      }
      // If onboarding_completed already exists for same user, don't change it
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
        avatar: response.user.avatar || "",
      };

      setUser(userData);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // CRITICAL: Set onboarding_completed to false for new users
      // This ensures onboarding flow will be shown
      localStorage.setItem("onboarding_completed", "false");
      
      // Reset tour flags for new user
      const userKey = userData.id || userData.email || "guest";
      localStorage.removeItem(`tour_seen_once_${userKey}`);
      localStorage.removeItem("tour_dismissed");

      console.log("✅ New user registered - onboarding_completed set to false");

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

  const updateUserProfile = async (profileData) => {
    try {
      // Update backend first
      const response = await authAPI.updateProfile(profileData);
      
      // Update local state and storage with response from backend
      const updatedUser = {
        id: user?.id || response.user.id,
        email: response.user.email,
        name: response.user.name,
        avatar: response.user.avatar || "",
      };
      
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      console.log("✅ Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      // Fallback to local update if API fails
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      throw error;
    }
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
