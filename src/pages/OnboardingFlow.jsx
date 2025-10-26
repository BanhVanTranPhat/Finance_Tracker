import { useState } from "react";
import { CategoryProvider } from "../contexts/CategoryContext.jsx";
import { FinanceProvider } from "../contexts/FinanceContext.jsx";
import IntroScreen from "./IntroScreen.jsx";
import IntroScreenDesktop from "./IntroScreenDesktop.jsx";
import CategorySelectionScreen from "./CategorySelectionScreen.jsx";
import CategorySelectionScreenDesktop from "./CategorySelectionScreenDesktop.jsx";

export default function OnboardingFlow({ onComplete }) {
  const [currentStep, setCurrentStep] = useState("intro");

  const handleIntroNext = () => {
    setCurrentStep("category-selection");
  };

  const handleCategoryBack = () => {
    setCurrentStep("intro");
  };

  const handleCategoryNext = () => {
    // Lưu trạng thái onboarding đã hoàn thành
    console.log(
      "🎉 Onboarding completed! Setting onboarding_completed to true"
    );
    localStorage.setItem("onboarding_completed", "true");
    console.log(
      "✅ onboarding_completed set to:",
      localStorage.getItem("onboarding_completed")
    );
    onComplete();
  };

  return (
    <CategoryProvider>
      <FinanceProvider>
        {currentStep === "intro" && (
          <>
            <div className="block lg:hidden">
              <IntroScreen onNext={handleIntroNext} />
            </div>
            <div className="hidden lg:block">
              <IntroScreenDesktop onNext={handleIntroNext} />
            </div>
          </>
        )}
        {currentStep === "category-selection" && (
          <>
            <div className="block lg:hidden">
              <CategorySelectionScreen
                onBack={handleCategoryBack}
                onNext={handleCategoryNext}
              />
            </div>
            <div className="hidden lg:block">
              <CategorySelectionScreenDesktop
                onBack={handleCategoryBack}
                onNext={handleCategoryNext}
              />
            </div>
          </>
        )}
      </FinanceProvider>
    </CategoryProvider>
  );
}
