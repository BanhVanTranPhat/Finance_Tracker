import { useState } from "react";
import {
  User,
  Camera,
  Bell,
  Shield,
  Palette,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit3,
  Save,
  X,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function SettingsScreenDesktop() {
  const { user, logout, updateUserProfile } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "Người dùng",
    email: user?.email || "user@example.com",
    avatar: user?.avatar || "",
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

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      logout();
    }
  };

  const handleResetData = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa tất cả dữ liệu tài chính? Hành động này không thể hoàn tác!"
      )
    ) {
      // Clear all financial data
      localStorage.removeItem("financial_goals");
      localStorage.removeItem("wallets");
      localStorage.removeItem("categories");
      localStorage.removeItem("transactions");

      // Reload the page to refresh all contexts
      window.location.reload();
    }
  };

  const settingsItems = [
    {
      icon: <User className="w-5 h-5" />,
      title: "Hồ sơ cá nhân",
      subtitle: "Chỉnh sửa thông tin cá nhân",
      action: () => setIsEditingProfile(true),
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: "Thông báo",
      subtitle: "Cài đặt thông báo",
      action: () => console.log("Notifications settings"),
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "Giao diện",
      subtitle: "Chủ đề và màu sắc",
      action: () => console.log("Theme settings"),
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Bảo mật",
      subtitle: "Mật khẩu và xác thực",
      action: () => console.log("Security settings"),
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Ngôn ngữ",
      subtitle: "Tiếng Việt",
      action: () => console.log("Language settings"),
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      title: "Trợ giúp",
      subtitle: "FAQ và hỗ trợ",
      action: () => console.log("Help"),
    },
    {
      icon: <Trash2 className="w-5 h-5" />,
      title: "Xóa dữ liệu",
      subtitle: "Xóa tất cả dữ liệu tài chính",
      action: handleResetData,
      isDanger: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Cài đặt</h1>
        <p className="text-gray-600 mt-1">
          Quản lý tài khoản và tùy chọn ứng dụng
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Profile */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Hồ sơ cá nhân
            </h3>
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto">
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
                {isEditingProfile && (
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Camera className="w-3 h-3 text-white" />
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Tên của bạn"
                  />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Email"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 px-3 py-2 bg-emerald-500 text-white text-sm rounded-lg flex items-center justify-center space-x-1"
                    >
                      <Save className="w-3 h-3" />
                      <span>Lưu</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 text-sm rounded-lg flex items-center justify-center space-x-1"
                    >
                      <X className="w-3 h-3" />
                      <span>Hủy</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    {profileData.name}
                  </h4>
                  <p className="text-gray-500 text-sm">{profileData.email}</p>
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="mt-3 text-emerald-600 text-sm flex items-center space-x-1 mx-auto"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Chỉnh sửa</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Tùy chọn ứng dụng
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {settingsItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between p-6 transition-colors ${
                    item.isDanger
                      ? "hover:bg-red-50 text-red-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={
                        item.isDanger ? "text-red-600" : "text-gray-600"
                      }
                    >
                      {item.icon}
                    </div>
                    <div className="text-left">
                      <div
                        className={`font-medium ${
                          item.isDanger ? "text-red-800" : "text-gray-800"
                        }`}
                      >
                        {item.title}
                      </div>
                      <div
                        className={`text-sm ${
                          item.isDanger ? "text-red-500" : "text-gray-500"
                        }`}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 ${
                      item.isDanger ? "text-red-400" : "text-gray-400"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* App Info */}
          <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-emerald-500 rounded"></div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">
                Finance Tracker
              </h3>
              <p className="text-sm text-gray-500 mb-4">Phiên bản 1.0.0</p>
              <div className="text-xs text-gray-400">
                © 2025 Finance Tracker. Tất cả quyền được bảo lưu.
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
