import { useState, useRef } from "react";
import {
  User,
  Camera,
  ChevronRight,
  Edit3,
  Save,
  X,
  Trash2,
  Wallet as WalletIcon,
  Globe,
  HelpCircle,
  LogOut,
  MessageCircle,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useCurrency } from "../contexts/CurrencyContext.jsx";
import { dataAPI } from "../services/api.js";

export default function SettingsScreenDesktop() {
  const { user, logout, updateUserProfile } = useAuth();
  const { currency, setCurrency, currencies, currencyName } = useCurrency();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || "Người dùng",
    email: user?.email || "user@example.com",
    avatar: user?.avatar || "",
  });

  // Language settings
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("app_language") || "vi";
  });

  const handleSaveProfile = () => {
    updateUserProfile(profileData);
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setProfileData({
      name: user?.name || "Người dùng",
      email: user?.email || "user@example.com",
      avatar: user?.avatar || "",
    });
    setIsEditingProfile(false);
  };

  const handleAvatarClick = () => {
    setShowAvatarModal(true);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader.result });
        setShowAvatarModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setProfileData({ ...profileData, avatar: "" });
    setShowAvatarModal(false);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem("app_language", newLanguage);
    setShowLanguageModal(false);
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      logout();
    }
  };

  const handleResetData = async () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa tất cả dữ liệu tài chính? Hành động này không thể hoàn tác!"
      )
    ) {
      try {
        await dataAPI.deleteAllData();
        localStorage.removeItem("financial_goals");
        localStorage.removeItem("wallets");
        localStorage.removeItem("categories");
        localStorage.removeItem("transactions");
        localStorage.removeItem("selected_wallet");
        localStorage.removeItem("selected_category");
        localStorage.removeItem("budget_data");
        localStorage.removeItem("analytics_data");
        localStorage.removeItem("user_preferences");
        localStorage.removeItem("google_oauth_login");
        localStorage.setItem("data_manually_cleared", "true");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting data:", error);
        alert("Có lỗi xảy ra khi xóa dữ liệu. Vui lòng thử lại.");
      }
    }
  };

  const accountSettings = [
    {
      icon: <User className="w-5 h-5" />,
      title: "Thông tin tài khoản",
      subtitle: "Chỉnh sửa thông tin cá nhân",
      action: () => setIsEditingProfile(true),
    },
    {
      icon: <WalletIcon className="w-5 h-5" />,
      title: "Ví mặc định",
      subtitle: currencyName,
      action: () => setShowCurrencyModal(true),
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Ngôn ngữ",
      subtitle: language === "vi" ? "Tiếng Việt" : "English",
      action: () => setShowLanguageModal(true),
    },
  ];

  const helpSettings = [
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "Liên hệ chúng tôi",
      subtitle: "Hỗ trợ và phản hồi",
      action: () => setShowContactModal(true),
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Hướng dẫn sử dụng",
      subtitle: "FAQ và tài liệu",
      action: () => setShowHelpModal(true),
    },
  ];

  return (
    <div className="space-y-6 pt-4">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Profile */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            {isEditingProfile ? (
              <div className="space-y-4">
                {/* Avatar with Camera Button */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center">
                      {profileData.avatar ? (
                        <img
                          src={profileData.avatar}
                          alt="Avatar"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-white" />
                      )}
                    </div>
                    <button
                      onClick={handleAvatarClick}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-lg"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="space-y-3">
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Tên của bạn"
                  />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Email"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 px-4 py-3 bg-emerald-500 text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Hủy</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-white" />
                  )}
                </div>
                <h4 className="text-lg font-semibold text-gray-800">
                  {profileData.name}
                </h4>
                <p className="text-gray-500 text-sm mt-1">
                  {profileData.email}
                </p>
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="mt-4 text-emerald-600 text-sm font-medium flex items-center gap-1.5 mx-auto hover:text-emerald-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Chỉnh sửa</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="xl:col-span-2 space-y-6">
          {/* Cài đặt */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Cài đặt</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {accountSettings.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-gray-600">{item.icon}</div>
                    <div className="text-left">
                      <div className="font-medium text-gray-800">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Trợ giúp */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Trợ giúp</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {helpSettings.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-gray-600">{item.icon}</div>
                    <div className="text-left">
                      <div className="font-medium text-gray-800">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <div>
            <button
              onClick={handleLogout}
              className="w-full bg-white text-gray-700 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
            >
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCurrencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[420px] rounded-2xl shadow-2xl max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-800">Chọn tiền tệ</h2>
              <button
                onClick={() => setShowCurrencyModal(false)}
                className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-2 px-6 py-4 overflow-y-auto flex-1">
              {Object.entries(currencies).map(([code, currencyInfo]) => (
                <button
                  key={code}
                  onClick={() => {
                    setCurrency(code);
                    setShowCurrencyModal(false);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                    currency === code
                      ? "bg-emerald-50 border-2 border-emerald-500"
                      : "bg-gray-50 border-2 border-transparent hover:bg-gray-100 active:bg-gray-200"
                  }`}
                >
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">
                      {currencyInfo.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {currencyInfo.code} ({currencyInfo.symbol})
                    </div>
                  </div>
                  {currency === code && (
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[500px] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Chọn ảnh đại diện
              </h2>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center space-x-3 p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-800">
                    Chọn từ thư viện
                  </div>
                  <div className="text-sm text-gray-500">
                    Chọn ảnh từ thiết bị của bạn
                  </div>
                </div>
              </button>

              {profileData.avatar && (
                <button
                  onClick={handleRemoveAvatar}
                  className="w-full flex items-center space-x-3 p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-800">
                      Xóa ảnh đại diện
                    </div>
                    <div className="text-sm text-gray-500">
                      Xóa ảnh hiện tại
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showLanguageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[400px] rounded-2xl shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-800">Chọn ngôn ngữ</h2>
              <button
                onClick={() => setShowLanguageModal(false)}
                className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-3 px-6 py-5 overflow-y-auto flex-1">
              <button
                onClick={() => handleLanguageChange("vi")}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                  language === "vi"
                    ? "bg-emerald-50 border-2 border-emerald-500"
                    : "bg-gray-50 border-2 border-transparent hover:bg-gray-100 active:bg-gray-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">🇻🇳</span>
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">
                      Tiếng Việt
                    </div>
                    <div className="text-sm text-gray-500">Vietnamese</div>
                  </div>
                </div>
                {language === "vi" && (
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </button>

              <button
                onClick={() => handleLanguageChange("en")}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                  language === "en"
                    ? "bg-emerald-50 border-2 border-emerald-500"
                    : "bg-gray-50 border-2 border-transparent hover:bg-gray-100 active:bg-gray-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">🇬🇧</span>
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">English</div>
                    <div className="text-sm text-gray-500">English</div>
                  </div>
                </div>
                {language === "en" && (
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[400px] rounded-2xl shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-800">
                Liên hệ chúng tôi
              </h2>
              <button
                onClick={() => setShowContactModal(false)}
                className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="px-6 py-5 overflow-y-auto flex-1">
              <div className="space-y-3">
                <div className="bg-emerald-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                    Email
                  </h3>
                  <p className="text-gray-700 font-medium">
                    support@financetracker.com
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                    Hotline
                  </h3>
                  <p className="text-gray-700 font-medium">1900 xxxx</p>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                    Website
                  </h3>
                  <p className="text-gray-700 font-medium">
                    www.financetracker.com
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowContactModal(false)}
                className="w-full mt-5 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 active:bg-emerald-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {showHelpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[440px] rounded-2xl shadow-2xl max-h-[75vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-800">
                Hướng dẫn sử dụng
              </h2>
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="px-6 py-5 overflow-y-auto flex-1">
              <div className="space-y-3">
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-emerald-600" />
                    Làm thế nào để thêm giao dịch?
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Truy cập tab "Ví", chọn ví bạn muốn thêm giao dịch, sau đó
                    nhấn vào nút "+" để thêm giao dịch mới.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
                    Làm thế nào để tạo ngân sách?
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Vào tab "Ngân sách", nhấn "Thiết lập ngân sách" và chọn danh
                    mục cùng số tiền ngân sách bạn muốn đặt.
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-purple-600" />
                    Tôi có thể xuất báo cáo không?
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Có, vào tab "Phân tích" để xem các biểu đồ và thống kê chi
                    tiết về thu chi của bạn.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full mt-5 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 active:bg-emerald-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
