import { Wallet, ArrowRight, X } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function WalletPromptModal({ isOpen, onClose, onCreateWallet }) {
  const { t } = useLanguage();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t("walletPromptTitle")}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            aria-label={t("close")}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {t("startManagingFinances")}
          </h3>
          <p className="text-gray-600 text-sm">
            {t("walletPromptDescription")}
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
            </div>
            <div>
              <p className="font-medium text-gray-800 text-sm">
                {t("manageMultipleWalletsTitle")}
              </p>
              <p className="text-gray-500 text-xs">
                {t("manageMultipleWalletsDesc")}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
            </div>
            <div>
              <p className="font-medium text-gray-800 text-sm">
                {t("trackBalanceTitle")}
              </p>
              <p className="text-gray-500 text-xs">
                {t("trackBalanceDesc")}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
            </div>
            <div>
              <p className="font-medium text-gray-800 text-sm">
                {t("recordTransactionsTitle")}
              </p>
              <p className="text-gray-500 text-xs">
                {t("recordTransactionsDesc")}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
          >
            {t("laterButton")}
          </button>
          <button
            onClick={() => {
              onCreateWallet();
              onClose();
            }}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>{t("createWalletNow")}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
