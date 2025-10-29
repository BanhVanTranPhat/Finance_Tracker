import { useState } from "react";
import { X, ChevronUp, ChevronDown, Menu, Trash2 } from "lucide-react";

export default function CategoryTutorial({ isOpen, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: "Lướt sang trái để xóa danh mục",
      content: (
        <div className="space-y-2 mb-6">
          <div className="bg-yellow-100 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center">
                <span className="text-xl">🛒</span>
              </div>
              <span className="font-medium text-gray-800">Mua sắm</span>
            </div>
            <Menu className="w-5 h-5 text-gray-400" />
          </div>

          <div className="bg-yellow-100 rounded-xl p-4 flex items-center relative overflow-hidden">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center">
                <span className="text-xl">🍽️</span>
              </div>
              <span className="font-medium text-gray-800">Ăn uống</span>
            </div>
            <div className="flex items-center gap-2">
              <Menu className="w-5 h-5 text-gray-400" />
              <div className="ml-2 bg-red-500 rounded-lg p-3">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
            </div>
            {/* Swipe indicator */}
            <div className="absolute right-24 top-1/2 -translate-y-1/2">
              <div className="flex items-center gap-1 text-red-500 animate-pulse">
                <span className="text-2xl">👆</span>
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-yellow-100 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center">
                <span className="text-xl">✈️</span>
              </div>
              <span className="font-medium text-gray-800">Du lịch</span>
            </div>
            <Menu className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      ),
    },
    {
      title: "Ấn vào từng danh mục/nhóm danh mục để sửa tên",
      content: (
        <div className="space-y-3 mb-6">
          <div className="bg-gray-100 rounded-xl p-4 text-center">
            <p className="text-lg font-semibold text-gray-700">Group Name</p>
            <div className="mt-1 text-red-500 text-2xl animate-pulse">👆</div>
          </div>

          <div className="space-y-2">
            <div className="bg-yellow-100 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center">
                <span className="text-xl">🍽️</span>
              </div>
              <span className="font-medium text-gray-800">Ăn uống</span>
            </div>

            <div className="bg-yellow-100 rounded-xl p-4 flex items-center gap-3 relative">
              <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center">
                <span className="text-xl">🛒</span>
              </div>
              <span className="font-medium text-gray-800">Mua sắm</span>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-2xl animate-pulse">
                👆
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Sắp xếp danh mục bằng cách kéo và thả",
      subtitle: "Sắp xếp nhóm danh mục bằng cách ấn mũi tên lên/xuống",
      content: (
        <div className="space-y-3 mb-6">
          {/* Group: Muốn */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-yellow-50 flex items-center justify-between">
              <span className="font-semibold text-gray-800">Muốn</span>
              <div className="flex gap-1">
                <button className="p-1">
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-1">
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 -mt-12 text-2xl animate-bounce">
                👆
              </div>
            </div>
            <div className="space-y-1 p-2">
              <div className="bg-yellow-50 rounded-lg p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-200 rounded-lg flex items-center justify-center">
                  <span className="text-lg">✈️</span>
                </div>
                <span className="text-sm text-gray-700">Du lịch</span>
                <Menu className="w-4 h-4 text-gray-400 ml-auto" />
                <div className="absolute right-16 text-xl animate-pulse">
                  ☝️
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-200 rounded-lg flex items-center justify-center">
                  <span className="text-lg">☕</span>
                </div>
                <span className="text-sm text-gray-700">
                  Cafe ăn uống bạn bè
                </span>
                <Menu className="w-4 h-4 text-gray-400 ml-auto" />
                <div className="absolute right-16 text-xl animate-pulse">
                  ☝️
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-200 rounded-lg flex items-center justify-center">
                  <span className="text-lg">💅</span>
                </div>
                <span className="text-sm text-gray-700">Chăm sóc bản thân</span>
                <Menu className="w-4 h-4 text-gray-400 ml-auto" />
              </div>
            </div>
          </div>

          {/* Group: Hóa đơn */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-gray-100 flex items-center justify-between">
              <span className="font-semibold text-gray-800">Hóa đơn</span>
              <div className="flex gap-1">
                <button className="p-1">
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-1">
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentSlideData = slides[currentSlide];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[70] p-6">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Content */}
        <div className="mt-8">
          {currentSlideData.content}

          {/* Title and Subtitle */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {currentSlideData.title}
            </h3>
            {currentSlideData.subtitle && (
              <p className="text-sm text-gray-600">
                {currentSlideData.subtitle}
              </p>
            )}
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentSlide ? "bg-yellow-500 w-8" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {currentSlide > 0 && (
              <button
                onClick={() => setCurrentSlide(currentSlide - 1)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Quay lại
              </button>
            )}
            {currentSlide < slides.length - 1 ? (
              <button
                onClick={() => setCurrentSlide(currentSlide + 1)}
                className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition-colors"
              >
                Tiếp tục
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
              >
                Hoàn thành
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

