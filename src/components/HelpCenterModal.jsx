import { X, RefreshCw, BookOpen } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function HelpCenterModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const restartTour = () => {
    // Signal provider to run tour again without affecting authentication
    localStorage.removeItem("tour_dismissed");
    // Force remove and re-add flag to trigger restart from step 1
    localStorage.removeItem("force_run_tour");
    setTimeout(() => {
      localStorage.setItem("force_run_tour", "true");
      // Trigger storage listeners in the same tab as well
      window.dispatchEvent(
        new StorageEvent("storage", { key: "force_run_tour", newValue: "true" })
      );
      // Also trigger custom event
      window.dispatchEvent(
        new CustomEvent("startTour")
      );
    }, 50);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700 font-bold">
            <BookOpen className="w-5 h-5" />
            {t("helpCenter")}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-sm text-gray-700 whitespace-pre-line">
            {t("helpCenterContent")}
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="font-semibold text-emerald-800 mb-1">{t("restartGuide")}</div>
            <div className="text-sm text-emerald-700 mb-3">{t("restartGuideDescription")}</div>
            <button
              onClick={restartTour}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> {t("restartGuide")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


