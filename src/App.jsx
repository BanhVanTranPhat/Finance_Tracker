import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import { TransactionProvider } from "./contexts/TransactionContext.jsx";
import { FinanceProvider } from "./contexts/FinanceContext.jsx";
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

function AppContent() {
  const { user, logout, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState("landing");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [activeTab, setActiveTab] = useState("budget");
  const [forceUpdate, setForceUpdate] = useState(0);

  // Debug logging
  const onboardingStatus = localStorage.getItem("onboarding_completed");
  console.log(
    "🔍 App render - user:",
    user,
    "isLoading:",
    isLoading,
    "pathname:",
    window.location.pathname,
    "forceUpdate:",
    forceUpdate,
    "onboarding_completed:",
    onboardingStatus,
    "shouldShowOnboarding:",
    onboardingStatus !== "true"
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

  // If user is authenticated and on dashboard, show dashboard
  if (user && window.location.pathname === "/dashboard") {
    const shouldShowOnboarding =
      localStorage.getItem("onboarding_completed") !== "true";

    if (shouldShowOnboarding) {
      return (
        <OnboardingFlow
          onComplete={() => {
            // Onboarding component đã đặt localStorage; chỉ cần kích hoạt re-render
            setForceUpdate((prev) => prev + 1);
          }}
        />
      );
    }

    // Show dashboard
    return (
      <FinanceProvider>
        <TransactionProvider>
          <GoalProvider>
            <div className="min-h-screen">
              {/* Main Content */}
              {activeTab === "budget" && <BudgetScreen />}
              {activeTab === "wallet" && <WalletScreen />}
              {activeTab === "transactions" && <TransactionsWithAnalytics />}
              {activeTab === "settings" && (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      Cài đặt
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Tính năng đang phát triển
                    </p>
                    <button
                      onClick={logout}
                      className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Navigation */}
              <BottomNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onCreateWallet={() => setShowWalletModal(true)}
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
            </div>
          </GoalProvider>
        </TransactionProvider>
      </FinanceProvider>
    );
  }

  // Calculate onboarding status - this will re-run when forceUpdate changes
  const shouldShowOnboarding =
    localStorage.getItem("onboarding_completed") !== "true";

  // Only show onboarding if user is authenticated and onboarding not completed
  if (user && shouldShowOnboarding) {
    return (
      <OnboardingFlow
        onComplete={() => {
          // Onboarding component đã đặt localStorage; chỉ cần kích hoạt re-render
          setForceUpdate((prev) => prev + 1);
        }}
      />
    );
  }

  const handleCreateWallet = () => {
    setShowWalletModal(true);
  };

  const handleSaveWallet = (walletData) => {
    console.log("Wallet saved:", walletData);
    // Wallet is already saved in context
  };

  return (
    <FinanceProvider>
      <TransactionProvider>
        <GoalProvider>
          <ResponsiveLayout
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onCreateWallet={handleCreateWallet}
            forceUpdate={forceUpdate}
          />

          {/* Modals */}
          {showWalletModal && (
            <WalletManagementModal
              isOpen={showWalletModal}
              onClose={() => setShowWalletModal(false)}
              onSave={handleSaveWallet}
            />
          )}
        </GoalProvider>
      </TransactionProvider>
    </FinanceProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
