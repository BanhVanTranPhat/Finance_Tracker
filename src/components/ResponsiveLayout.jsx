import React, { useState, useEffect, useRef } from "react";
import DesktopSidebar from "./DesktopSidebar.jsx";
import BottomNav from "./BottomNav.jsx";
import BudgetScreen from "./BudgetScreen.jsx";
import BudgetScreenDesktop from "./BudgetScreenDesktop.jsx";
import WalletScreen from "./WalletScreen.jsx";
import WalletScreenDesktop from "./WalletScreenDesktop.jsx";
import SettingsScreen from "./SettingsScreen.jsx";
import SettingsScreenDesktop from "./SettingsScreenDesktop.jsx";
import TransactionsWithAnalytics from "./TransactionsWithAnalytics.jsx";
import WalletPromptModal from "./WalletPromptModal.jsx";
import TransactionModal from "./TransactionModal.jsx";
import TransferMoneyModal from "./TransferMoneyModal.jsx";
import QuickActionModal from "./QuickActionModal.jsx";
import WalletManagementModal from "./WalletManagementModal.jsx";
import { useFinance } from "../contexts/FinanceContext.jsx";

export default function ResponsiveLayout({
  activeTab,
  onTabChange,
  onCreateWallet,
  forceUpdate = 0,
}) {
  const { wallets, addTransaction } = useFinance();
  const [showWalletPrompt, setShowWalletPrompt] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showTypedTransaction, setShowTypedTransaction] = useState(false);
  const [initialTransactionType, setInitialTransactionType] = useState("expense");
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Store initial window width to prevent unwanted mobile switching
  const initialWidth = useRef(window.innerWidth);
  const [isMobile, setIsMobile] = useState(() => {
    // Use the same breakpoint as Tailwind CSS lg: (1024px)
    const initialIsMobile = window.innerWidth < 1024;
    return initialIsMobile;
  });

  // Listen for window resize
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 1024;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
      }
    };

    // Initial check to ensure correct state
    const initialCheck = () => {
      const newIsMobile = window.innerWidth < 1024;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
      }
    };

    // Run initial check after a short delay to ensure window is fully loaded
    const timeoutId = setTimeout(initialCheck, 100);

    // Listen for custom force update event
    const handleForceUpdate = () => {
      const currentWidth = window.innerWidth;
      const newIsMobile = currentWidth < 1024;

      // Google OAuth protection: Always prefer desktop layout for better UX
      const isGoogleOAuth =
        localStorage.getItem("google_oauth_login") === "true";

      if (isGoogleOAuth && currentWidth >= 1024) {
        setIsMobile(false);
        // Clear the flag after using it
        localStorage.removeItem("google_oauth_login");
        return;
      }

      // Protection: If we started on desktop and width hasn't changed significantly, stay desktop
      if (initialWidth.current >= 1024 && currentWidth >= 1024 && isMobile) {
        setIsMobile(false);
        return;
      }

      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("forceResponsiveUpdate", handleForceUpdate);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("forceResponsiveUpdate", handleForceUpdate);
      clearTimeout(timeoutId);
    };
  }, []);

  // Re-check when forceUpdate changes (e.g., after Google login)
  useEffect(() => {
    if (forceUpdate > 0) {
      // Force re-check with a small delay to ensure window is ready
      const timeoutId = setTimeout(() => {
        const currentWidth = window.innerWidth;
        const newIsMobile = currentWidth < 1024;

        // Google OAuth protection: Always prefer desktop layout for better UX
        const isGoogleOAuth =
          localStorage.getItem("google_oauth_login") === "true";

        if (isGoogleOAuth && currentWidth >= 1024) {
          setIsMobile(false);
          // Clear the flag after using it
          localStorage.removeItem("google_oauth_login");
          return;
        }

        // Protection: If we started on desktop and width hasn't changed significantly, stay desktop
        if (initialWidth.current >= 1024 && currentWidth >= 1024 && isMobile) {
          setIsMobile(false);
          return;
        }

        // Only update if the state actually needs to change
        if (newIsMobile !== isMobile) {
          setIsMobile(newIsMobile);
        }
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [forceUpdate]); // Remove isMobile dependency to prevent infinite loop

  // Debug logging removed for cleaner console

  // Final protection: If we're on desktop but isMobile is true, force correct it
  if (window.innerWidth >= 1024 && isMobile) {
    setIsMobile(false);
  }

  // Additional Google OAuth check on every render
  useEffect(() => {
    const isGoogleOAuth = localStorage.getItem("google_oauth_login") === "true";
    if (isGoogleOAuth && window.innerWidth >= 1024 && isMobile) {
      setIsMobile(false);
      localStorage.removeItem("google_oauth_login");
    }
  });

  // Handle wallet creation from prompt
  const handleCreateWalletFromPrompt = () => {
    setShowWalletPrompt(false);
    setShowWalletModal(true);
  };

  // Handle transaction save
  const handleTransactionSave = async (transactionData) => {
    try {
      await addTransaction(transactionData);
      setShowTransactionModal(false);
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  // Handle add transaction - check if user has wallets first
  const handleAddTransaction = () => {
    // Check if user has no wallets
    if (!wallets || wallets.length === 0) {
      // Navigate to wallet tab first
      onTabChange("wallet");
      
      // Start tour guide to create wallet
      setTimeout(() => {
        // Set flag to start tour from step 5 (create wallet)
        localStorage.setItem("force_run_tour", "true");
        localStorage.setItem("tour_start_from_step", "5"); // Custom flag to start from step 5
        
        // Dispatch events to start tour
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "force_run_tour",
            newValue: "true",
          })
        );
        window.dispatchEvent(new CustomEvent("startTour"));
      }, 500); // Wait for tab navigation to complete
      
      return;
    }
    
    // User has wallets, proceed with normal transaction modal
    setShowTransactionModal(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "budget":
        return isMobile ? <BudgetScreen /> : <BudgetScreenDesktop />;
      case "wallet":
        return isMobile ? <WalletScreen /> : <WalletScreenDesktop />;
      case "transactions":
        return <TransactionsWithAnalytics />;
      case "settings":
        return isMobile ? <SettingsScreen /> : <SettingsScreenDesktop />;
      default:
        return isMobile ? <BudgetScreen /> : <BudgetScreenDesktop />;
    }
  };

  if (isMobile) {
    // Mobile layout - keep existing design
    return (
      <div className="min-h-screen">
        {renderContent()}
        <BottomNav
          activeTab={activeTab}
          onTabChange={onTabChange}
          onCreateWallet={() => setShowWalletPrompt(true)}
          onCentralAction={handleAddTransaction}
        />

        {/* Wallet Prompt Modal */}
        <WalletPromptModal
          isOpen={showWalletPrompt}
          onClose={() => setShowWalletPrompt(false)}
          onCreateWallet={handleCreateWalletFromPrompt}
        />

        {/* Quick Action then Transaction/Transfer */}
        <QuickActionModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          onPick={(action) => {
            setShowTransactionModal(false);
            if (action === "transfer") {
              setShowTransferModal(true);
            } else {
              setInitialTransactionType(action);
              setShowTypedTransaction(true);
            }
          }}
        />

        {showTypedTransaction && (
          <TransactionModal
            isOpen={showTypedTransaction}
            onClose={() => setShowTypedTransaction(false)}
            onSave={handleTransactionSave}
            initialType={initialTransactionType}
            mode="add"
          />
        )}

        <TransferMoneyModal
          isOpen={showTransferModal}
          onClose={() => setShowTransferModal(false)}
        />

        {/* Wallet Management Modal */}
        {showWalletModal && (
          <WalletManagementModal
            isOpen={showWalletModal}
            onClose={() => setShowWalletModal(false)}
            onSave={() => {
              setShowWalletModal(false);
            }}
            mode="create"
          />
        )}
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Sidebar */}
      <DesktopSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        onAddTransaction={handleAddTransaction}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar - Hidden for cleaner desktop layout */}

        {/* Content Area - let the whole page scroll to avoid static sidebar feel */}
        <div className="flex-1">
          <div className="p-6">{renderContent()}</div>
        </div>
      </div>

      {/* Quick Action then Transaction/Transfer for Desktop */}
      <QuickActionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        onPick={(action) => {
          setShowTransactionModal(false);
          if (action === "transfer") {
            setShowTransferModal(true);
          } else {
            setInitialTransactionType(action);
            setShowTypedTransaction(true);
          }
        }}
      />

      {showTypedTransaction && (
        <TransactionModal
          isOpen={showTypedTransaction}
          onClose={() => setShowTypedTransaction(false)}
          onSave={handleTransactionSave}
          initialType={initialTransactionType}
          mode="add"
        />
      )}

      <TransferMoneyModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
      />
    </div>
  );
}
