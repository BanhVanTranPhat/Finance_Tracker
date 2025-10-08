import { TrendingUp, PieChart, Target, Calendar, Download, Shield, BarChart3, Wallet, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

export default function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  const features = [
    {
      icon: BarChart3,
      title: 'Theo dõi thu chi',
      description: 'Ghi lại mọi khoản thu nhập và chi tiêu một cách dễ dàng, nhanh chóng',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: PieChart,
      title: 'Phân tích chi tiêu',
      description: 'Biểu đồ trực quan giúp bạn hiểu rõ các khoản chi tiêu của mình',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Target,
      title: 'Mục tiêu tiết kiệm',
      description: 'Đặt mục tiêu tài chính và theo dõi tiến độ đạt được',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Calendar,
      title: 'Giao dịch định kỳ',
      description: 'Tự động ghi nhận các khoản thu chi lặp lại hàng tháng',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: TrendingUp,
      title: 'Xu hướng tài chính',
      description: 'Xem xu hướng thu chi theo thời gian để có quyết định tốt hơn',
      color: 'from-pink-500 to-pink-600',
    },
    {
      icon: Download,
      title: 'Xuất báo cáo',
      description: 'Tải xuống dữ liệu dưới dạng CSV hoặc PDF để lưu trữ',
      color: 'from-teal-500 to-teal-600',
    },
  ];

  const benefits = [
    'Miễn phí 100% - Không có phí ẩn',
    'Giao diện đẹp, dễ sử dụng',
    'Bảo mật thông tin tuyệt đối',
    'Truy cập mọi lúc, mọi nơi',
    'Cập nhật tính năng liên tục',
    'Hỗ trợ đa thiết bị',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl shadow-lg">
                <Wallet className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Finance Tracker
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onLogin}
                className="text-gray-700 hover:text-emerald-600 px-4 py-2 rounded-lg font-medium transition"
              >
                Đăng nhập
              </button>
              <button
                onClick={onRegister}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-2 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
              >
                Đăng ký miễn phí
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Shield className="w-4 h-4" />
              Bảo mật & Miễn phí 100%
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Quản lý tài chính
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                thông minh hơn
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Theo dõi chi tiêu, phân tích xu hướng và đạt được mục tiêu tài chính của bạn.
              Tất cả trong một ứng dụng đơn giản, dễ sử dụng.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onRegister}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
              >
                Bắt đầu ngay - Miễn phí
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onLogin}
                className="border-2 border-gray-300 hover:border-emerald-500 text-gray-700 hover:text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg transition"
              >
                Đăng nhập
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition duration-500">
              <div className="bg-white rounded-2xl p-6 transform -rotate-3">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500 p-2 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Thu nhập tháng này</p>
                        <p className="text-xl font-bold text-gray-900">15.000.000 ₫</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-500 p-2 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-white rotate-180" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Chi tiêu tháng này</p>
                        <p className="text-xl font-bold text-gray-900">8.500.000 ₫</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500 p-2 rounded-lg">
                        <Wallet className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tiết kiệm được</p>
                        <p className="text-xl font-bold text-gray-900">6.500.000 ₫</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600">
              Mọi thứ bạn cần để quản lý tài chính hiệu quả
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition group"
                >
                  <div className={`bg-gradient-to-br ${feature.color} p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn chúng tôi?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-md"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-emerald-500 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Sẵn sàng bắt đầu hành trình tài chính của bạn?
          </h2>
          <p className="text-xl text-emerald-50 mb-8">
            Tham gia cùng hàng nghìn người dùng đã cải thiện tài chính của họ
          </p>
          <button
            onClick={onRegister}
            className="bg-white hover:bg-gray-50 text-emerald-600 px-10 py-4 rounded-xl font-bold text-lg transition shadow-xl hover:shadow-2xl inline-flex items-center gap-2"
          >
            Đăng ký miễn phí ngay
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Finance Tracker</span>
            </div>
            <p className="text-gray-400">
              © 2025 Finance Tracker. Quản lý tài chính thông minh.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
