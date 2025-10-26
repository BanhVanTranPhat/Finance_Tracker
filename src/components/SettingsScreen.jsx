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
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function SettingsScreen() {
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-emerald-600 pt-12 pb-6 px-4">
        <h1 className="text-2xl font-bold text-white text-center">Cài đặt</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              {isEditingProfile && (
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Camera className="w-3 h-3 text-white" />
                </button>
              )}
            </div>
            <div className="flex-1">
              {isEditingProfile ? (
                <div className="space-y-2">
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
                      className="px-3 py-1 bg-emerald-500 text-white text-sm rounded-lg flex items-center space-x-1"
                    >
                      <Save className="w-3 h-3" />
                      <span>Lưu</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-lg flex items-center space-x-1"
                    >
                      <X className="w-3 h-3" />
                      <span>Hủy</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {profileData.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{profileData.email}</p>
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="mt-2 text-emerald-600 text-sm flex items-center space-x-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Chỉnh sửa</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Settings List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {settingsItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className={`w-full flex items-center justify-between p-4 transition-colors ${
                item.isDanger
                  ? "hover:bg-red-50 text-red-600"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={item.isDanger ? "text-red-600" : "text-gray-600"}
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

        {/* App Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
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
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-4 rounded-2xl font-medium flex items-center justify-center space-x-2 hover:bg-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
