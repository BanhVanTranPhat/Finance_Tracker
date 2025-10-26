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

export default function ResponsiveLayout({
  activeTab,
  onTabChange,
  onCreateWallet,
  forceUpdate = 0,
}) {
  // Store initial window width to prevent unwanted mobile switching
  const initialWidth = useRef(window.innerWidth);
  const [isMobile, setIsMobile] = useState(() => {
    // Use the same breakpoint as Tailwind CSS lg: (1024px)
    const initialIsMobile = window.innerWidth < 1024;
    console.log("🔍 ResponsiveLayout initial state:", {
      width: window.innerWidth,
      isMobile: initialIsMobile,
      initialWidth: initialWidth.current,
    });
    return initialIsMobile;
  });

  // Listen for window resize
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 1024;
      console.log("🔄 ResponsiveLayout resize:", {
        width: window.innerWidth,
        isMobile: newIsMobile,
      });
      if (newIsMobile !== isMobile) {
        console.log(
          "🔄 isMobile state changing from",
          isMobile,
          "to",
          newIsMobile
        );
        setIsMobile(newIsMobile);
      }
    };

    // Initial check to ensure correct state
    const initialCheck = () => {
      const newIsMobile = window.innerWidth < 1024;
      console.log("🔍 ResponsiveLayout initial check:", {
        width: window.innerWidth,
        isMobile: newIsMobile,
      });
      if (newIsMobile !== isMobile) {
        console.log(
          "🔄 isMobile state changing from",
          isMobile,
          "to",
          newIsMobile
        );
        setIsMobile(newIsMobile);
      }
    };

    // Run initial check after a short delay to ensure window is fully loaded
    const timeoutId = setTimeout(initialCheck, 100);

    // Listen for custom force update event
    const handleForceUpdate = () => {
      console.log("🔄 Received forceResponsiveUpdate event");
      const currentWidth = window.innerWidth;
      const newIsMobile = currentWidth < 1024;

      console.log("🔍 Force update check:", {
        width: currentWidth,
        isMobile: newIsMobile,
        currentIsMobile: isMobile,
        initialWidth: initialWidth.current,
      });

      // Google OAuth protection: Always prefer desktop layout for better UX
      const isGoogleOAuth = localStorage.getItem("google_oauth_login") === "true";
      
      if (isGoogleOAuth && currentWidth >= 1024) {
        console.log("🛡️ Google OAuth detected: Forcing desktop layout");
        setIsMobile(false);
        // Clear the flag after using it
        localStorage.removeItem("google_oauth_login");
        return;
      }

      // Protection: If we started on desktop and width hasn't changed significantly, stay desktop
      if (initialWidth.current >= 1024 && currentWidth >= 1024 && isMobile) {
        console.log(
          "🛡️ Protection: Forcing desktop layout (was mobile, should be desktop)"
        );
        setIsMobile(false);
        return;
      }

      if (newIsMobile !== isMobile) {
        console.log(
          "🔄 isMobile state changing from",
          isMobile,
          "to",
          newIsMobile
        );
        setIsMobile(newIsMobile);
      } else {
        console.log("✅ isMobile state is correct:", newIsMobile);
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
      console.log("🔄 ResponsiveLayout forceUpdate triggered:", forceUpdate);

      // Force re-check with a small delay to ensure window is ready
      const timeoutId = setTimeout(() => {
        const currentWidth = window.innerWidth;
        const newIsMobile = currentWidth < 1024;
        console.log("🔍 ResponsiveLayout forceUpdate check (delayed):", {
          width: currentWidth,
          isMobile: newIsMobile,
          currentIsMobile: isMobile,
          initialWidth: initialWidth.current,
        });

        // Google OAuth protection: Always prefer desktop layout for better UX
        const isGoogleOAuth = localStorage.getItem("google_oauth_login") === "true";
        
        if (isGoogleOAuth && currentWidth >= 1024) {
          console.log("🛡️ Google OAuth detected: Forcing desktop layout");
          setIsMobile(false);
          // Clear the flag after using it
          localStorage.removeItem("google_oauth_login");
          return;
        }

        // Protection: If we started on desktop and width hasn't changed significantly, stay desktop
        if (initialWidth.current >= 1024 && currentWidth >= 1024 && isMobile) {
          console.log(
            "🛡️ Protection: Forcing desktop layout (was mobile, should be desktop)"
          );
          setIsMobile(false);
          return;
        }

        // Only update if the state actually needs to change
        if (newIsMobile !== isMobile) {
          console.log(
            "🔄 isMobile state changing from",
            isMobile,
            "to",
            newIsMobile
          );
          setIsMobile(newIsMobile);
        } else {
          console.log("✅ isMobile state is correct:", newIsMobile);
        }
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [forceUpdate]); // Remove isMobile dependency to prevent infinite loop

  console.log("🔍 ResponsiveLayout render:", {
    isMobile,
    width: window.innerWidth,
    activeTab,
    forceUpdate,
    initialWidth: initialWidth.current,
    timestamp: new Date().toISOString(),
  });

  // Final protection: If we're on desktop but isMobile is true, force correct it
  if (window.innerWidth >= 1024 && isMobile) {
    console.log("🛡️ Final protection: Forcing desktop layout on render");
    setIsMobile(false);
  }

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
    console.log("📱 Rendering mobile layout");
    return (
      <div className="min-h-screen">
        {renderContent()}
        <BottomNav
          activeTab={activeTab}
          onTabChange={onTabChange}
          onCreateWallet={onCreateWallet}
        />
      </div>
    );
  }

  // Desktop layout
  console.log("🖥️ Rendering desktop layout");
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DesktopSidebar activeTab={activeTab} onTabChange={onTabChange} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar - Hidden for cleaner desktop layout */}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
