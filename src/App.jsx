import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import { TransactionProvider } from "./contexts/TransactionContext.jsx";
import { FinanceProvider, useFinance } from "./contexts/FinanceContext.jsx";
import { CurrencyProvider } from "./contexts/CurrencyContext.jsx";
import { LanguageProvider } from "./contexts/LanguageContext.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Register from "./pages/Register.jsx";
import OnboardingFlow from "./pages/OnboardingFlow.jsx";
import GoogleCallback from "./pages/GoogleCallback.jsx";
import BottomNav from "./components/BottomNav.jsx";
import BudgetScreen from "./components/BudgetScreen.jsx";
import BudgetScreenDesktop from "./components/BudgetScreenDesktop.jsx";
import WalletScreen from "./components/WalletScreen.jsx";
import WalletScreenDesktop from "./components/WalletScreenDesktop.jsx";
import AnalyticsScreen from "./components/AnalyticsScreen.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import TransactionsWithAnalytics from "./components/TransactionsWithAnalytics.jsx";
import WalletManagementModal from "./components/WalletManagementModal.jsx";
import SettingsScreen from "./components/SettingsScreen.jsx";
import SettingsScreenDesktop from "./components/SettingsScreenDesktop.jsx";
import ResponsiveLayout from "./components/ResponsiveLayout.jsx";
import OnboardingTourProvider from "./components/OnboardingTourProvider.jsx";

// Component to check if user has categories and show onboarding if needed
function DashboardWithCategoryCheck({
  activeTab,
  onTabChange,
  showWalletModal,
  setShowWalletModal,
  forceUpdate,
  setForceUpdate,
}) {
  const { categories, loading } = useFinance();
  const { user } = useAuth();

  // Initialize shouldShowOnboarding based on onboarding_completed flag
  // This ensures onboarding shows immediately for new users
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(() => {
    const onboardingCompleted =
      localStorage.getItem("onboarding_completed") === "true";
    return !onboardingCompleted; // Show onboarding if not completed
  });

  useEffect(() => {
    // Check onboarding status and categories
    const onboardingCompleted =
      localStorage.getItem("onboarding_completed") === "true";
    const hasCategories = categories && categories.length > 0;

    console.log("🔍 Onboarding check:", {
      loading,
      onboardingCompleted,
      hasCategories,
      categoriesCount: categories?.length || 0,
      userId: user?.id || user?.email,
    });

    // Wait for data to finish loading
    if (!loading) {
      // Show onboarding if:
      // 1. Onboarding is not completed (new user), OR
      // 2. User has no categories (might have skipped or cleared data)
      if (!onboardingCompleted || !hasCategories) {
        console.log("✅ Should show onboarding");
        setShouldShowOnboarding(true);
      } else {
        console.log("❌ Should NOT show onboarding");
        setShouldShowOnboarding(false);
      }
    } else {
      // While loading, if onboarding not completed, prepare to show it
      if (!onboardingCompleted) {
        console.log("⏳ Loading - preparing to show onboarding");
        setShouldShowOnboarding(true);
      }
    }
  }, [categories, loading, forceUpdate, user]);

  // Auto run guided tour once for new users right after first dashboard load
  // Only run if onboarding is completed and user has categories
  useEffect(() => {
    if (loading || shouldShowOnboarding) return;

    const onboardingCompleted =
      localStorage.getItem("onboarding_completed") === "true";
    if (!onboardingCompleted) return; // Don't run tour if onboarding not completed

    // Check if user has categories (onboarding just completed)
    const hasCategories = categories && categories.length > 0;
    if (!hasCategories) return; // Don't run if no categories

    const userKey = (
      user?.id ||
      user?._id ||
      user?.email ||
      "guest"
    ).toString();
    const seenKey = `tour_seen_once_${userKey}`;
    const seen = localStorage.getItem(seenKey) === "true";

    if (!seen) {
      localStorage.setItem(seenKey, "true");
      // Wait for UI to fully render before starting tour
      // Use longer delay to ensure all elements are ready
      setTimeout(() => {
        localStorage.setItem("force_run_tour", "true");
        // Dispatch both storage event and custom event for better compatibility
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "force_run_tour",
            newValue: "true",
          })
        );
        // Also dispatch a custom event
        window.dispatchEvent(new CustomEvent("startTour"));
      }, 2000); // Increased delay to ensure UI is fully ready
    }
  }, [loading, user, shouldShowOnboarding, categories]);

  // Listen for tour navigation events (MUST be before early returns to avoid hook order issues)
  useEffect(() => {
    const handleTourNavigationToWallet = (event) => {
      if (event.detail) {
        const stepIndex = event.detail.stepIndex;
        const forStep3 = event.detail.forStep3;
        const forStep5 = event.detail.forStep5;

        // Navigate to wallet tab for step 3 (index 2) or step 5 (index 4)
        // Also handle stepIndex 3 for backwards compatibility
        if (
          stepIndex === 2 ||
          stepIndex === 4 ||
          stepIndex === 3 ||
          forStep3 ||
          forStep5
        ) {
          const stepNumber =
            stepIndex === 2 || forStep3
              ? 3
              : stepIndex === 4 || forStep5
              ? 5
              : stepIndex === 3
              ? 5
              : 3;
          console.log(
            `🔄 Tour navigation: Switching to wallet tab for step ${stepNumber}`
          );
          // Only navigate if not already on wallet tab
          if (activeTab !== "wallet") {
            onTabChange("wallet");
          }
        }
      }
    };

    const handleTourNavigationToBudget = (event) => {
      // Navigate to budget tab for step 1 (when restarting tour)
      console.log("🔄 Tour navigation: Switching to budget tab for step 1");
      if (activeTab !== "budget") {
        onTabChange("budget");
      }
    };

    window.addEventListener(
      "tourNavigateToWallet",
      handleTourNavigationToWallet
    );
    window.addEventListener(
      "tourNavigateToBudget",
      handleTourNavigationToBudget
    );
    return () => {
      window.removeEventListener(
        "tourNavigateToWallet",
        handleTourNavigationToWallet
      );
      window.removeEventListener(
        "tourNavigateToBudget",
        handleTourNavigationToBudget
      );
    };
  }, [onTabChange, activeTab]);

  // Show loading while checking
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Đang tải...
          </h2>
          <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  // Show onboarding if no categories or onboarding not completed
  if (shouldShowOnboarding) {
    return (
      <OnboardingFlow
        onComplete={async () => {
          console.log("✅ Onboarding completed - refreshing categories");

          // Set flag first
          localStorage.setItem("onboarding_completed", "true");

          // Wait a bit for backend to save categories
          await new Promise((resolve) => setTimeout(resolve, 1200));

          // Force FinanceProvider remount by updating forceUpdate key
          // This will trigger FinanceContext to reload all data
          setForceUpdate((prev) => prev + 1);

          // Small delay to ensure FinanceProvider remounts before re-checking
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Now re-check categories - shouldShowOnboarding will be false if categories exist
          setShouldShowOnboarding(false);

          // Trigger tour after onboarding completes and UI is ready
          // Use a longer delay to ensure all UI elements are rendered
          const userKey = (
            user?.id ||
            user?._id ||
            user?.email ||
            "guest"
          ).toString();
          const seenKey = `tour_seen_once_${userKey}`;
          const seen = localStorage.getItem(seenKey) === "true";

          if (!seen) {
            localStorage.setItem(seenKey, "true");
            // Wait for dashboard to fully render
            setTimeout(() => {
              localStorage.setItem("force_run_tour", "true");
              // Dispatch both storage event and custom event
              window.dispatchEvent(
                new StorageEvent("storage", {
                  key: "force_run_tour",
                  newValue: "true",
                })
              );
              window.dispatchEvent(new CustomEvent("startTour"));
            }, 2500); // Give enough time for UI to render
          }
        }}
      />
    );
  }

  // Show dashboard if user has categories
  return (
    <TransactionProvider>
      <OnboardingTourProvider enabled>
        <ResponsiveLayout
          activeTab={activeTab}
          onTabChange={onTabChange}
          onCreateWallet={() => setShowWalletModal(true)}
          forceUpdate={forceUpdate}
        />

        {/* Modals */}
        {showWalletModal && (
          <WalletManagementModal
            isOpen={showWalletModal}
            onClose={() => setShowWalletModal(false)}
            onSave={(walletData) => {
              console.log("Wallet saved:", walletData);
            }}
          />
        )}
      </OnboardingTourProvider>
    </TransactionProvider>
  );
}

function AppContent() {
  const { user, logout, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState("landing");
  const [resetEmail, setResetEmail] = useState("");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [activeTab, setActiveTab] = useState("budget");
  const [forceUpdate, setForceUpdate] = useState(0);

  // Debug logging removed for cleaner console

  // Check localStorage for credentials when on dashboard
  useEffect(() => {
    if (window.location.pathname === "/dashboard" && !user && !isLoading) {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        // Found credentials in localStorage, triggering AuthContext update

        // Force a re-render by dispatching a storage event
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "user",
            newValue: storedUser,
            oldValue: null,
            url: window.location.href,
          })
        );

        // Also force a re-render
        setForceUpdate((prev) => prev + 1);
      }
    }
  }, [user, isLoading, forceUpdate]);

  // Check onboarding status when forceUpdate changes
  useEffect(() => {
    // This effect will trigger re-render when onboarding completes
    // Check if onboarding was just completed
    const onboardingCompleted =
      localStorage.getItem("onboarding_completed") === "true";
  }, [forceUpdate]);

  // Check if this is a Google OAuth callback
  if (window.location.pathname === "/auth/callback") {
    return <GoogleCallback />;
  }

  // Check if user is trying to access dashboard
  if (window.location.pathname === "/dashboard" && !user && !isLoading) {
    // Check if we have token in localStorage (Google OAuth might be in progress)
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      // We have credentials but AuthContext hasn't loaded yet, show loading

      // Force a re-render by dispatching a storage event
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "user",
          newValue: storedUser,
          oldValue: null,
          url: window.location.href,
        })
      );

      // Also force a re-render after a short delay
      setTimeout(() => {
        setForceUpdate((prev) => prev + 1);
      }, 100);

      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Đang tải...
            </h2>
            <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      );
    }

    // No credentials, redirect to login
    window.location.href = "/";
    return null;
  }

  if (!user) {
    if (currentPage === "login") {
      return (
        <Login
          onSwitchToRegister={() => setCurrentPage("register")}
          onBackToLanding={() => setCurrentPage("landing")}
          onForgotPassword={() => setCurrentPage("forgot")}
        />
      );
    }
    if (currentPage === "register") {
      return (
        <Register
          onSwitchToLogin={() => setCurrentPage("login")}
          onBackToLanding={() => setCurrentPage("landing")}
        />
      );
    }
    if (currentPage === "forgot") {
      return (
        <ForgotPassword
          onBack={() => setCurrentPage("login")}
          onGoToReset={(email) => {
            setResetEmail(email);
            setCurrentPage("reset");
          }}
        />
      );
    }
    if (currentPage === "reset") {
      return (
        <ResetPassword
          onBack={() => setCurrentPage("login")}
          defaultEmail={resetEmail}
        />
      );
    }
    return (
      <LandingPage
        onLogin={() => setCurrentPage("login")}
        onRegister={() => setCurrentPage("register")}
      />
    );
  }

  // If user is authenticated, show dashboard with category checking
  if (user) {
    return (
      <FinanceProvider key={`finance-${forceUpdate}`}>
        <DashboardWithCategoryCheck
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showWalletModal={showWalletModal}
          setShowWalletModal={setShowWalletModal}
          forceUpdate={forceUpdate}
          setForceUpdate={setForceUpdate}
        />
      </FinanceProvider>
    );
  }

  // Default return for other cases
  return null;
}

function App() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}

export default App;
