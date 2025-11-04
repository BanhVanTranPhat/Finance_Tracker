import { useEffect, useMemo, useState } from "react";
import Joyride, { STATUS } from "react-joyride";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function OnboardingTourProvider({ children, enabled = true }) {
  const { t } = useLanguage();
  const [run, setRun] = useState(false);
  const [tourKey, setTourKey] = useState(0); // Key to force remount Joyride and reset to step 1
  const [startStepIndex, setStartStepIndex] = useState(0); // Index to start tour from (0-based)

  useEffect(() => {
    if (!enabled) return;
    
    const checkAndRunTour = () => {
      const force = localStorage.getItem("force_run_tour") === "true";
      const completed = localStorage.getItem("onboarding_completed") === "true";
      const dismissed = localStorage.getItem("tour_dismissed") === "true";
      const startFromStep = localStorage.getItem("tour_start_from_step");
      
      // Only run tour if forced to run (from App.jsx after onboarding or from add transaction)
      if (force && completed && !dismissed) {
        // Check if we should start from a specific step
        if (startFromStep) {
          const stepIndex = parseInt(startFromStep, 10) - 1; // Convert to 0-based index
          if (stepIndex >= 0 && stepIndex < 5) {
            setStartStepIndex(stepIndex);
            localStorage.removeItem("tour_start_from_step");
          }
        }
        
        // Wait a bit to ensure DOM is ready
        setTimeout(() => {
          setRun(true);
          localStorage.removeItem("force_run_tour");
        }, 300);
      }
    };

    // Check immediately
    checkAndRunTour();

    // Also check when onboarding status changes
    const intervalId = setInterval(checkAndRunTour, 500);

    return () => clearInterval(intervalId);
  }, [enabled]);

  useEffect(() => {
    // Helper to check if at least the first tour target exists
    // We only need the first target to start the tour, others can be checked as we go
    const checkFirstTourTargetExists = () => {
      const firstTarget = '[data-tour="manage-groups-btn"]';
      return document.querySelector(firstTarget) !== null;
    };

    // Helper to log which targets exist for debugging
    const logTourTargets = () => {
      const targets = [
        '[data-tour="manage-groups-btn"]',
        '[data-tour="budget-list"]',
        '[data-tour="wallet-update-btn"]',
        '[data-tour="add-transaction-btn"]',
        '[data-tour="create-wallet-btn"]',
      ];
      const existing = targets.filter((target) => document.querySelector(target) !== null);
      console.log("🎯 Tour targets check:", {
        existing: existing.length,
        total: targets.length,
        found: existing,
        missing: targets.filter((t) => !existing.includes(t)),
      });
      return existing.length > 0; // Start tour if at least one target exists
    };

    // Check for force_run_tour and ensure at least first target is ready
    const checkTourFlag = () => {
      const force = localStorage.getItem("force_run_tour") === "true";
      const startFromStep = localStorage.getItem("tour_start_from_step");
      
      if (force) {
        // Check if we should start from a specific step (e.g., step 5 for wallet creation)
        if (startFromStep) {
          const stepIndex = parseInt(startFromStep, 10) - 1; // Convert to 0-based index
          if (stepIndex === 4) {
            // Starting from step 5 (create wallet) - navigate to wallet tab
            console.log("🔄 Starting tour from step 5 (create wallet) - navigating to wallet tab");
            // Don't set stepIndex yet - wait until target is confirmed ready in checkTargets
            window.dispatchEvent(
              new CustomEvent("tourNavigateToWallet", { detail: { stepIndex: 4, forStep5: true, immediate: true } })
            );
          } else {
            setStartStepIndex(stepIndex);
          }
        } else {
          // Reset to start from step 1
          setStartStepIndex(0);
          // Step 1 target is only in Budget tab, so navigate there first
          console.log("🔄 Restarting tour - navigating to Budget tab for step 1");
          window.dispatchEvent(
            new CustomEvent("tourNavigateToBudget", { detail: { restart: true } })
          );
        }
        
        // Reset tour state
        setRun(false);
        setTourKey(prev => prev + 1); // Force remount Joyride component
        
        // Wait for tab navigation and DOM to be ready
        setTimeout(() => {
          // Wait for tour targets to be in DOM (after tab navigation)
          const checkTargets = (retries = 0) => {
            logTourTargets(); // Log for debugging
            
            // Check if starting from step 5 (wallet creation)
            if (startFromStep === "5") {
              const step5Target = document.querySelector('[data-tour="create-wallet-btn"]');
              
              console.log(`🔍 Checking step 5 target (retry ${retries + 1}):`, {
                step5: step5Target ? "✅" : "❌",
                step5Visible: step5Target && step5Target.offsetParent !== null ? "✅" : "❌"
              });
              
              if (step5Target && step5Target.offsetParent !== null) {
                console.log("✅ Starting tour from step 5 - target found and visible");
                // Ensure stepIndex is set before starting tour
                setStartStepIndex(4);
                setTimeout(() => {
                  setRun(true);
                  localStorage.removeItem("force_run_tour");
                }, 300);
              } else {
                // Retry after a short delay if target not ready
                if (retries < 20) {
                  console.log(`⏳ Waiting for step 5 target... (retry ${retries + 1}/20)`);
                  if (!step5Target) console.warn("   ⚠️ Step 5 target missing");
                  if (step5Target && step5Target.offsetParent === null) console.warn("   ⚠️ Step 5 target exists but not visible");
                  
                  // Re-ensure wallet tab is active on each retry
                  window.dispatchEvent(
                    new CustomEvent("tourNavigateToWallet", { detail: { stepIndex: 4, forStep5: true, force: true, retry: retries } })
                  );
                  
                  setTimeout(() => checkTargets(retries + 1), 300);
                } else {
                  console.warn("⚠️ Max retries reached - cannot start tour from step 5 (target not found)");
                  localStorage.removeItem("force_run_tour");
                  localStorage.removeItem("tour_start_from_step");
                  // Don't start tour if target is not found - it will cause errors
                  // Instead, show a message or fallback to step 1
                  setStartStepIndex(0);
                  console.log("⚠️ Falling back to starting tour from step 1");
                  // Optionally start from step 1 instead
                  // setTimeout(() => {
                  //   setRun(true);
                  // }, 300);
                }
              }
            } else {
              // Starting from step 1 - check step 1 and step 2 targets (both are in Budget tab)
              const step1Target = document.querySelector('[data-tour="manage-groups-btn"]');
              const step2Target = document.querySelector('[data-tour="budget-list"]');
              
              console.log(`🔍 Checking targets (retry ${retries + 1}):`, {
                step1: step1Target ? "✅" : "❌",
                step2: step2Target ? "✅" : "❌",
                step2Visible: step2Target && step2Target.offsetParent !== null ? "✅" : "❌"
              });
              
              // CRITICAL: Both targets must exist AND be visible in DOM
              if (step1Target && step2Target && step2Target.offsetParent !== null) {
                console.log("✅ Starting tour - step 1 and step 2 targets found and visible");
                // Add small delay to ensure DOM is fully stable
                setTimeout(() => {
                  setRun(true);
                  localStorage.removeItem("force_run_tour");
                }, 300);
              } else {
                // Retry after a short delay if targets not ready
                if (retries < 20) { // Max 20 retries (6 seconds total) - increased for step 2
                  console.log(`⏳ Waiting for tour targets... (retry ${retries + 1}/20)`);
                  if (!step1Target) console.warn("   ⚠️ Step 1 target missing");
                  if (!step2Target) console.warn("   ⚠️ Step 2 target missing");
                  if (step2Target && step2Target.offsetParent === null) console.warn("   ⚠️ Step 2 target exists but not visible");
                  
                  // Re-ensure Budget tab is active on each retry
                  if (!step2Target || step2Target.offsetParent === null) {
                    window.dispatchEvent(
                      new CustomEvent("tourNavigateToBudget", { detail: { force: true, retry: retries } })
                    );
                  }
                  
                  setTimeout(() => checkTargets(retries + 1), 300);
                } else {
                  console.error("❌ Tour targets not found after multiple retries");
                  console.error(`   Step 1: ${step1Target ? "✅" : "❌"}, Step 2: ${step2Target ? "✅" : "❌"}, Step 2 Visible: ${step2Target && step2Target.offsetParent !== null ? "✅" : "❌"}`);
                  // Start anyway but log warning
                  setRun(true);
                  localStorage.removeItem("force_run_tour");
                }
              }
            }
          };
          checkTargets();
        }, 1000); // Increased delay to allow tab navigation and DOM rendering to complete
      }
    };

    // Check immediately
    checkTourFlag();

    // Listen for storage events (works across tabs)
    const onStorage = (e) => {
      if (e.key === "force_run_tour" && e.newValue === "true") {
        checkTourFlag();
      }
    };

    // Listen for custom event (works in same tab)
    const onStartTour = () => {
      checkTourFlag();
    };

    // Check periodically in case events are missed
    const intervalId = setInterval(checkTourFlag, 500);

    window.addEventListener("storage", onStorage);
    window.addEventListener("startTour", onStartTour);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("startTour", onStartTour);
      clearInterval(intervalId);
    };
  }, []);

  const steps = useMemo(
    () => {
      const baseSteps = [
        {
          target: '[data-tour="manage-groups-btn"]',
          content: t("tourStep1ManageGroups"),
          placement: "bottom",
          disableBeacon: true,
        },
        {
          target: '[data-tour="budget-list"]',
          content: t("tourStep2BudgetList"),
          placement: "top",
          disableBeacon: false, // Ensure step 2 is visible
        },
        {
          target: '[data-tour="wallet-update-btn"]',
          content: t("tourStep3WalletUpdate"),
          placement: "top",
        },
        {
          target: '[data-tour="add-transaction-btn"]',
          content: t("tourStep4AddTransaction"),
          placement: "top",
        },
        // Step 5 now works on both desktop and mobile
        {
          target: '[data-tour="create-wallet-btn"]',
          content: t("tourStep5CreateWallet"),
          placement: "top",
          disableBeacon: true,
        },
      ];

      return baseSteps;
    },
    [t]
  );

  const handleCallback = (data) => {
    const { status, action, index, step, type } = data;
    
    console.log("🎯 Tour callback:", { status, action, index, step, type });
    
    // Handle step:before event - navigate BEFORE step renders (CRITICAL for step 3 and step 5)
    if (type === "step:before") {
      if (index === 2) {
        // Step 3 is about to be rendered - navigate to wallet tab NOW
        console.log("🚨 Step 3 BEFORE render - navigating to wallet tab IMMEDIATELY...");
        window.dispatchEvent(
          new CustomEvent("tourNavigateToWallet", { detail: { stepIndex: index, forStep3: true, beforeRender: true } })
        );
      } else if (index === 4) {
        // Step 5 is about to be rendered - ensure wallet tab is active NOW
        console.log("🚨 Step 5 BEFORE render - ensuring wallet tab is active IMMEDIATELY...");
        window.dispatchEvent(
          new CustomEvent("tourNavigateToWallet", { detail: { stepIndex: index, forStep5: true, beforeRender: true } })
        );
      }
    }
    
    // Handle step actions
    if (action === "next" || action === "prev") {
      // Tour is progressing, log for debugging
      console.log(`📍 Tour step ${index + 1}/${steps.length}: ${step?.content}`);
    }
    
    // When on step 1 and about to move to step 2, ensure step 2 target exists
    if (action === "next" && index === 0) {
      // We're on step 1, user clicked next, about to move to step 2
      // CRITICAL: Check step 2 target BEFORE Joyride tries to render it
      console.log("📍 Moving from step 1 to step 2 - checking step 2 target...");
      const step2Target = document.querySelector('[data-tour="budget-list"]');
      if (!step2Target) {
        console.error("❌ Step 2 target not found! Ensuring Budget tab is active...");
        window.dispatchEvent(
          new CustomEvent("tourNavigateToBudget", { detail: { force: true } })
        );
      } else {
        console.log("✅ Step 2 target ready, proceeding to step 2");
      }
    }
    
    // Also check when step 1 is updated - prepare for step 2
    if (action === "update" && index === 0) {
      // Step 1 is being displayed, ensure step 2 target will be ready
      const step2Target = document.querySelector('[data-tour="budget-list"]');
      if (!step2Target) {
        console.warn("⚠️ Step 2 target not ready yet - ensuring Budget tab...");
        window.dispatchEvent(
          new CustomEvent("tourNavigateToBudget", { detail: { force: true } })
        );
      }
    }
    
    // Log when step 2 is being updated/displayed - CRITICAL to ensure step 2 shows
    if (action === "update" && index === 1) {
      const step2Target = document.querySelector('[data-tour="budget-list"]');
      const isVisible = step2Target && step2Target.offsetParent !== null;
      console.log(`🔄 Step 2 update - Target exists: ${step2Target ? "YES" : "NO"}, Visible: ${isVisible ? "YES" : "NO"}`);
      
      if (!step2Target || !isVisible) {
        console.error("❌ Step 2 target not found or not visible during update! Ensuring Budget tab is active...");
        // CRITICAL: Ensure we're on Budget tab where step 2 target should be
        window.dispatchEvent(
          new CustomEvent("tourNavigateToBudget", { detail: { force: true, forStep2: true } })
        );
        
        // Wait a bit then check again - if still not found, this step will be skipped
        setTimeout(() => {
          const retryTarget = document.querySelector('[data-tour="budget-list"]');
          const retryVisible = retryTarget && retryTarget.offsetParent !== null;
          if (retryTarget && retryVisible) {
            console.log("✅ Step 2 target found and visible after navigation retry");
          } else {
            console.error("❌ Step 2 target still not found/visible - Joyride may skip this step!");
          }
        }, 500);
      } else {
        console.log("✅ Step 2 target found and visible, step should display correctly");
      }
    }
    
    // IMPORTANT: Do NOT navigate away during step 2 render; this caused it to be skipped
    // We'll navigate for step 3 in step:before (index === 2) or when clicking Next from step 2
    
    // Also navigate when clicking next from step 2 as backup
    if (action === "next" && index === 1) {
      // User clicked next from step 2 - ensure wallet tab is ready NOW
      console.log("📍 Step 2 next clicked - ensuring wallet tab is ready IMMEDIATELY for step 3");
      window.dispatchEvent(
        new CustomEvent("tourNavigateToWallet", { detail: { stepIndex: 2, forStep3: true, force: true } })
      );
    }
    
    // When step 3 is being updated/rendered, ensure wallet tab is active and target exists
    if (action === "update" && index === 2) {
      // Step 3 is being rendered NOW - ensure wallet tab is active
      console.log("🔄 Step 3 update - ensuring wallet tab is active and target exists...");
      
      // Re-ensure navigation (in case step:before didn't complete)
      window.dispatchEvent(
        new CustomEvent("tourNavigateToWallet", { detail: { stepIndex: index, forStep3: true } })
      );
      
      // Check if target exists after a short delay (allowing navigation to complete)
      setTimeout(() => {
        const step3Target = document.querySelector('[data-tour="wallet-update-btn"]');
        const isVisible = step3Target && step3Target.offsetParent !== null;
        
        if (step3Target && isVisible) {
          console.log("✅ Step 3 target ready and visible");
        } else {
          console.warn("⚠️ Step 3 target not ready yet, retrying navigation...");
          // Retry navigation if target still not ready
          window.dispatchEvent(
            new CustomEvent("tourNavigateToWallet", { detail: { stepIndex: index, forStep3: true, retry: true } })
          );
          
          // Check again after retry with longer delay
          setTimeout(() => {
            const retryTarget = document.querySelector('[data-tour="wallet-update-btn"]');
            if (retryTarget && retryTarget.offsetParent !== null) {
              console.log("✅ Step 3 target ready after retry");
            } else {
              console.error("❌ Step 3 target still not found - may cause issues");
            }
          }, 500);
        }
      }, 300); // Increased delay to allow navigation to complete
    }
    
    // When step 5 is being updated/rendered, ensure wallet tab is active and target exists
    if (action === "update" && index === 4) {
      // Step 5 is being rendered NOW - ensure wallet tab is active
      console.log("🔄 Step 5 update - ensuring wallet tab is active and target exists...");
      
      // Re-ensure navigation (in case step:before didn't complete)
      window.dispatchEvent(
        new CustomEvent("tourNavigateToWallet", { detail: { stepIndex: index, forStep5: true } })
      );
      
      // Check if target exists after a short delay
      setTimeout(() => {
        const step5Target = document.querySelector('[data-tour="create-wallet-btn"]');
        const isVisible = step5Target && step5Target.offsetParent !== null;
        
        if (step5Target && isVisible) {
          console.log("✅ Step 5 target ready and visible");
        } else {
          console.warn("⚠️ Step 5 target not ready yet, retrying navigation...");
          // Retry navigation if target still not ready
          window.dispatchEvent(
            new CustomEvent("tourNavigateToWallet", { detail: { stepIndex: index, forStep5: true, retry: true } })
          );
          
          // Check again after retry
          setTimeout(() => {
            const retryTarget = document.querySelector('[data-tour="create-wallet-btn"]');
            if (retryTarget && retryTarget.offsetParent !== null) {
              console.log("✅ Step 5 target ready after retry");
            } else {
              console.error("❌ Step 5 target still not found - may cause issues");
            }
          }, 500);
        }
      }, 300);
    }
    
    // When step 4 is being updated/displayed, IMMEDIATELY navigate for step 5
    // Navigate IMMEDIATELY so target is ready BEFORE Joyride checks for step 5
    if (action === "update" && index === 3) {
      // Step 4 is displaying NOW - navigate IMMEDIATELY to prepare for step 5
      console.log("🔄 Step 4 displaying - navigating to wallet tab IMMEDIATELY for step 5...");
      window.dispatchEvent(
        new CustomEvent("tourNavigateToWallet", { detail: { stepIndex: 4, forStep5: true, immediate: true } })
      );
    }
    
    // Also navigate when clicking next from step 4 as backup
    if (action === "next" && index === 3) {
      // User clicked next from step 4 - ensure wallet tab is ready NOW
      console.log("📍 Step 4 next clicked - ensuring wallet tab is ready IMMEDIATELY for step 5");
      window.dispatchEvent(
        new CustomEvent("tourNavigateToWallet", { detail: { stepIndex: 4, forStep5: true, force: true } })
      );
    }
    
    // Check if target exists for current step, if not, log warning
    if ((action === "next" || action === "prev" || action === "update") && step?.target) {
      const targetElement = document.querySelector(step.target);
      if (!targetElement) {
        console.warn(`⚠️ Tour target not found: ${step.target} at step ${index + 1}`);
        
        // If step 2 target not found, ensure we're on Budget tab
        if (step.target === '[data-tour="budget-list"]') {
          console.error("❌ Step 2 target missing! Ensuring Budget tab is active...");
          window.dispatchEvent(
            new CustomEvent("tourNavigateToBudget", { detail: { force: true } })
          );
          // Retry after navigation
          setTimeout(() => {
            const retryTarget = document.querySelector('[data-tour="budget-list"]');
            if (retryTarget) {
              console.log("✅ Step 2 target found after navigation retry");
            } else {
              console.error("❌ Step 2 target still not found after navigation!");
            }
          }, 500);
        }
        
        // If step 3 target not found, try to navigate to wallet tab
        if (step.target === '[data-tour="wallet-update-btn"]') {
          console.log("🔄 Step 3 target missing, navigating to wallet tab...");
          window.dispatchEvent(
            new CustomEvent("tourNavigateToWallet", { detail: { stepIndex: index, force: true } })
          );
        }
        
        // If step 5 target not found, try to navigate again
        if (step.target === '[data-tour="create-wallet-btn"]') {
          console.log("🔄 Step 5 target missing, navigating to wallet tab...");
          window.dispatchEvent(
            new CustomEvent("tourNavigateToWallet", { detail: { stepIndex: index, force: true } })
          );
        }
      }
    }
    
    const finished = [STATUS.FINISHED, STATUS.SKIPPED].includes(status);
    if (finished) {
      console.log("✅ Tour finished or skipped");
      localStorage.setItem("tour_dismissed", "true");
      setRun(false);
      // Reset tour key when finished to prepare for next restart
      setTourKey(prev => prev + 1);
      setStartStepIndex(0); // Reset to start from step 1 next time
      localStorage.removeItem("tour_start_from_step");
    }
    
    // Handle errors (e.g., target not found)
    if (type === "error:target_not_found") {
      console.error(`❌ Tour target not found: ${step?.target} at step ${index + 1}`);
      
      // If step 2 target not found, ensure we're on Budget tab and retry
      if (step?.target === '[data-tour="budget-list"]') {
        console.error("❌ Step 2 target not found! Ensuring Budget tab is active...");
        window.dispatchEvent(
          new CustomEvent("tourNavigateToBudget", { detail: { force: true } })
        );
        // Wait a bit then check again - but Joyride will have already skipped, so we log this for debugging
        setTimeout(() => {
          const retryTarget = document.querySelector('[data-tour="budget-list"]');
          console.log(`   Step 2 target after navigation: ${retryTarget ? "✅ Found" : "❌ Still missing"}`);
        }, 500);
      }
      
      // If step 3 target not found, try to navigate to wallet tab
      if (step?.target === '[data-tour="wallet-update-btn"]') {
        console.log("🔄 Step 3 target not found, navigating to wallet tab...");
        window.dispatchEvent(
          new CustomEvent("tourNavigateToWallet", { detail: { stepIndex: index, force: true } })
        );
      }
      
      // If step 5 target not found, try to navigate to wallet tab
      if (step?.target === '[data-tour="create-wallet-btn"]') {
        console.log("🔄 Step 5 target not found, navigating to wallet tab...");
        window.dispatchEvent(
          new CustomEvent("tourNavigateToWallet", { detail: { stepIndex: index, force: true } })
        );
      }
      // Continue tour even if one step fails
    }
  };

  return (
    <>
      {enabled && (
        <Joyride
          key={tourKey} // Force remount when key changes to reset to step 1
          run={run}
          steps={steps}
          stepIndex={startStepIndex > 0 && run ? startStepIndex : undefined} // Only set stepIndex when tour is running and target is ready
          continuous
          showProgress
          showSkipButton
          disableOverlayClose={false}
          spotlightClicks
          disableScrollParentFix={false}
          scrollToFirstStep={true}
          floaterProps={{
            disableAnimation: false,
          }}
          styles={{
            options: {
              primaryColor: "#059669", // emerald-600
              zIndex: 10000,
              arrowColor: "#ffffff",
            },
            tooltip: {
              borderRadius: 12,
              padding: 20,
            },
            tooltipContainer: {
              textAlign: "left",
            },
          }}
          locale={{
            back: t("goBack"),
            close: t("close"),
            last: t("finish"),
            next: t("next"),
            skip: t("skip"),
          }}
          callback={handleCallback}
        />
      )}
      {children}
    </>
  );
}


