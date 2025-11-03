import { useEffect, useState } from "react";
import { X, Info } from "lucide-react";

export default function ContextTip({ storageKey, children }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(storageKey) === "true";
    if (!dismissed) setVisible(true);
  }, [storageKey]);

  if (!visible) return null;

  return (
    <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-start gap-2">
      <div className="mt-0.5">
        <Info className="w-4 h-4" />
      </div>
      <div className="text-sm flex-1">{children}</div>
      <button
        onClick={() => {
          localStorage.setItem(storageKey, "true");
          setVisible(false);
        }}
        className="text-emerald-700/70 hover:text-emerald-900"
        aria-label="Đóng"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}


