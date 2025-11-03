import { X, ArrowDownCircle, ArrowUpCircle, ArrowLeftRight } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function QuickActionModal({ isOpen, onClose, onPick }) {
  const { t } = useLanguage();
  
  if (!isOpen) return null;

  const actions = [
    { id: "expense", label: t("expense"), icon: ArrowDownCircle, color: "text-red-600" },
    { id: "income", label: t("income"), icon: ArrowUpCircle, color: "text-emerald-600" },
    { id: "transfer", label: t("transfer"), icon: ArrowLeftRight, color: "text-indigo-600" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:w-[420px] rounded-t-2xl sm:rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">{t("whatDoYouWantToCreate")}</h3>
          <button onClick={onClose} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {actions.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => onPick(id)}
              className="rounded-xl border border-gray-200 p-4 hover:bg-gray-50 active:scale-95 transition"
            >
              <Icon className={`w-6 h-6 mx-auto ${color}`} />
              <div className="mt-2 text-xs font-medium text-gray-700 text-center">{label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


