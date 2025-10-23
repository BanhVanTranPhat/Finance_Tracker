import { useState } from "react";
import { ArrowRight, X, Target, Users } from "lucide-react";

export default function OnboardingPrompt() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Target className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-blue-800 mb-1">
            Chưa hoàn tất thiết lập ban đầu?
          </h3>
          <p className="text-sm text-blue-700 mb-3">
            Hoàn tất quá trình onboarding để tận dụng tối đa các tính năng của
            ứng dụng.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                localStorage.removeItem("onboarding_completed");
                window.location.reload();
              }}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-1"
            >
              <Users className="w-4 h-4" />
              <span>Bắt đầu onboarding</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors"
            >
              Bỏ qua
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          aria-label="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
