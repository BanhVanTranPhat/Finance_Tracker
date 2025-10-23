import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import { TransactionProvider } from "./contexts/TransactionContext.jsx";
import { FinanceProvider } from "./contexts/FinanceContext.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import OnboardingFlow from "./pages/OnboardingFlow.jsx";
import GoogleCallback from "./pages/GoogleCallback.jsx";
import BottomNav from "./components/BottomNav.jsx";
import BudgetScreen from "./components/BudgetScreen.jsx";
import WalletScreen from "./components/WalletScreen.jsx";
import AnalyticsScreen from "./components/AnalyticsScreen.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import WalletManagementModal from "./components/WalletManagementModal.jsx";

function AppContent() {
  const { user, logout, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState("landing");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [activeTab, setActiveTab] = useState("budget");

  // Check if this is a Google OAuth callback
  if (window.location.pathname === "/auth/callback") {
    return <GoogleCallback />;
  }

  // Check if user is trying to access dashboard
  if (window.location.pathname === "/dashboard" && !user && !isLoading) {
    // Redirect to login if not authenticated and not loading
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
            window.location.reload();
          }}
        />
      );
    }

    // Show dashboard
    return (
      <FinanceProvider>
        <TransactionProvider>
          <div className="min-h-screen">
            {/* Main Content */}
            {activeTab === "budget" && <BudgetScreen />}
            {activeTab === "wallet" && <WalletScreen />}
            {activeTab === "analytics" && <AnalyticsScreen />}
            {activeTab === "transactions" && <TransactionsPage />}
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
        </TransactionProvider>
      </FinanceProvider>
    );
  }

  const shouldShowOnboarding =
    localStorage.getItem("onboarding_completed") !== "true";

  if (shouldShowOnboarding) {
    return (
      <OnboardingFlow
        onComplete={() => {
          // Onboarding component đã đặt localStorage; chỉ cần kích hoạt re-render
          window.location.reload();
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
        <div className="min-h-screen">
          {/* Main Content */}
          {activeTab === "budget" && <BudgetScreen />}
          {activeTab === "wallet" && <WalletScreen />}
          {activeTab === "analytics" && <AnalyticsScreen />}
          {activeTab === "transactions" && <TransactionsPage />}
          {activeTab === "settings" && (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Cài đặt
                </h2>
                <p className="text-gray-600 mb-6">Tính năng đang phát triển</p>
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
            onCreateWallet={handleCreateWallet}
          />

          {/* Modals */}
          {showWalletModal && (
            <WalletManagementModal
              isOpen={showWalletModal}
              onClose={() => setShowWalletModal(false)}
              onSave={handleSaveWallet}
            />
          )}
        </div>
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
