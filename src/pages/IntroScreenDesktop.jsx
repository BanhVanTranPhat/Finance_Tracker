import {
  ArrowRight,
  Target,
  DollarSign,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

export default function IntroScreenDesktop({ onNext }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
            <Target className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chào mừng đến với Finance Tracker
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ứng dụng quản lý tài chính cá nhân thông minh
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Quản lý chi tiêu thông minh Info */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Quản lý chi tiêu thông minh
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Phương pháp lập ngân sách dựa trên con số không
            </p>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                    Thu Nhập - Chi Tiêu = 0
                  </h3>
                  <p className="text-gray-600">
                    Mọi đồng tiền kiếm được đều phải được "giao việc" trước khi
                    bạn thực sự tiêu nó.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Target className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                    Tạo các "Phong bì"
                  </h3>
                  <p className="text-gray-600">
                    Chia tiền vào các danh mục cụ thể như Ăn uống, Đi lại, Tiết
                    kiệm...
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                    Kiểm soát hoàn toàn
                  </h3>
                  <p className="text-gray-600">
                    Bạn biết chính xác tiền đi đâu và có thể điều chỉnh linh
                    hoạt.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Benefits */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
            <h3 className="font-bold text-emerald-800 mb-6 text-center text-xl">
              Lợi ích của Quản lý chi tiêu thông minh
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">
                  Kiểm soát chi tiêu tốt hơn
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">
                  Tiết kiệm nhiều hơn
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">
                  Đạt được mục tiêu tài chính
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">
                  Giảm stress về tiền bạc
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">
                  Tăng cường kỷ luật tài chính
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">
                  Lập kế hoạch tương lai tốt hơn
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Sẵn sàng bắt đầu hành trình tài chính?
            </h3>
            <p className="text-gray-600 mb-8">
              Hãy bắt đầu quản lý tài chính thông minh với Finance Tracker
            </p>
            <button
              onClick={onNext}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 px-8 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mx-auto"
            >
              <span>Bắt đầu ngay</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
