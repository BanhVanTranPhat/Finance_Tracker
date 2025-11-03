import { useLanguage } from "../contexts/LanguageContext.jsx";
import { translateCategoryName } from "../utils/translateCategoryName.js";

export default function DeleteCategoryConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  categoryName,
}) {
  const { language } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-6">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full relative">
        {/* Emoji Character */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl">
            <div className="text-6xl">😮</div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-20 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Bạn muốn xóa "{translateCategoryName(categoryName, language)}" thật hả?
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Số tiền còn lại trong danh mục sẽ trở thành "Tiền chưa có việc". Các
            giao dịch trong danh mục này vẫn có thể xem được ở trong ví.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={onConfirm}
              className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold py-4 rounded-xl transition-all"
            >
              ỦA XÓA ĐI
            </button>
            <button
              onClick={onClose}
              className="w-full bg-white border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50 active:bg-yellow-100 font-bold py-4 rounded-xl transition-all"
            >
              THÔI, KHÔNG XÓA NỮA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

