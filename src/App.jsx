import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import { TransactionProvider } from "./contexts/TransactionContext.jsx";
import { FinanceProvider, useFinance } from "./contexts/FinanceContext.jsx";
import { GoalProvider } from "./contexts/GoalContext.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
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
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);

  useEffect(() => {
    // Wait for data to load
    if (!loading) {
      console.log("🔍 Checking categories:", categories?.length || 0);

      // Check if user has any categories
      const hasCategories = categories && categories.length > 0;

      if (!hasCategories) {
        console.log("❌ No categories found - redirecting to onboarding");
        setShouldShowOnboarding(true);
      } else {
        console.log("✅ User has categories:", categories.length);
        setShouldShowOnboarding(false);
        // Update localStorage to reflect that onboarding is completed
        localStorage.setItem("onboarding_completed", "true");
      }
    }
  }, [categories, loading, forceUpdate]);

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

  // Show onboarding if no categories
  if (shouldShowOnboarding) {
    return (
      <OnboardingFlow
        onComplete={async () => {
          console.log("✅ Onboarding completed - refreshing categories");

          // Set flag first
          localStorage.setItem("onboarding_completed", "true");

          // Wait a bit for backend to save categories
          await new Promise((resolve) => setTimeout(resolve, 800));

          // Force state update to re-check categories
          console.log("🔄 Forcing state update to reload categories...");
          setShouldShowOnboarding(false);
          setForceUpdate((prev) => prev + 1);
        }}
      />
    );
  }

  // Show dashboard if user has categories
  return (
    <TransactionProvider>
      <GoalProvider>
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
      </GoalProvider>
    </TransactionProvider>
  );
}

function AppContent() {
  const { user, logout, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState("landing");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [activeTab, setActiveTab] = useState("budget");
  const [forceUpdate, setForceUpdate] = useState(0);

  // Debug logging
  console.log(
    "🔍 App render - user:",
    user,
    "isLoading:",
    isLoading,
    "pathname:",
    window.location.pathname,
    "forceUpdate:",
    forceUpdate
  );

  // Check localStorage for credentials when on dashboard
  useEffect(() => {
    if (window.location.pathname === "/dashboard" && !user && !isLoading) {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        console.log(
          "🔄 Found credentials in localStorage, triggering AuthContext update via useEffect"
        );

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
    console.log(
      "🔄 Force update triggered:",
      forceUpdate,
      "at",
      new Date().toISOString()
    );

    // Check if onboarding was just completed
    const onboardingCompleted =
      localStorage.getItem("onboarding_completed") === "true";
    console.log("📋 Onboarding status:", onboardingCompleted);
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

    console.log(
      "🔍 Dashboard check - token:",
      !!token,
      "storedUser:",
      !!storedUser
    );

    if (token && storedUser) {
      // We have credentials but AuthContext hasn't loaded yet, show loading
      console.log(
        "🔄 Found credentials in localStorage, triggering AuthContext update"
      );

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
    console.log("❌ No credentials found, redirecting to login");
    window.location.href = "/";
    return null;
  }

  if (!user) {
    if (currentPage === "login") {
      return <Login onSwitchToRegister={() => setCurrentPage("register")} />;
    }
    if (currentPage === "register") {
      return <Register onSwitchToLogin={() => setCurrentPage("login")} />;
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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
