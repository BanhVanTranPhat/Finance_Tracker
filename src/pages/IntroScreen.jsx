import { ArrowRight, Target, DollarSign, TrendingUp } from "lucide-react";

export default function IntroScreen({ onNext }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-6 px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Chào mừng đến với Finance Tracker
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Ứng dụng quản lý chi tiêu cá nhân thông minh
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Quản lý chi tiêu thông minh
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Theo dõi và phân tích thu chi một cách dễ dàng
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Nhập thu nhập và chi tiêu
                </h3>
                <p className="text-sm text-gray-600">
                  Ghi lại tất cả các khoản thu chi hàng ngày để biết bạn đang
                  tiêu tiền vào đâu.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Target className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Phân loại theo danh mục
                </h3>
                <p className="text-sm text-gray-600">
                  Chia tiền vào các danh mục cụ thể như Ăn uống, Đi lại, Giải
                  trí...
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Xem biểu đồ và thống kê
                </h3>
                <p className="text-sm text-gray-600">
                  Phân tích chi tiêu qua biểu đồ trực quan, dễ hiểu.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
          <h3 className="font-semibold text-emerald-800 mb-3 text-center">
            Tính năng chính
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Quản lý thu chi đơn giản</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Biểu đồ trực quan, dễ hiểu</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Lọc và sắp xếp giao dịch</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Quản lý nhiều ví tiền</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6">
        <button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
        >
          <span>Bắt đầu ngay</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
