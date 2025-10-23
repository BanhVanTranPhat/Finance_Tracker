import { useState } from "react";
import { CategoryProvider } from "../contexts/CategoryContext.jsx";
import { FinanceProvider } from "../contexts/FinanceContext.jsx";
import IntroScreen from "./IntroScreen.jsx";
import CategorySelectionScreen from "./CategorySelectionScreen.jsx";

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
    localStorage.setItem("onboarding_completed", "true");
    onComplete();
  };

  return (
    <CategoryProvider>
      <FinanceProvider>
        {currentStep === "intro" && <IntroScreen onNext={handleIntroNext} />}
        {currentStep === "category-selection" && (
          <CategorySelectionScreen
            onBack={handleCategoryBack}
            onNext={handleCategoryNext}
          />
        )}
      </FinanceProvider>
    </CategoryProvider>
  );
}
