import { useState, useRef, useEffect } from "react";
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
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import HelpCenterModal from "./HelpCenterModal.jsx";
import { useCurrency } from "../contexts/CurrencyContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { dataAPI } from "../services/api.js";
import { useFinance } from "../contexts/FinanceContext.jsx";

export default function SettingsScreenDesktop() {
  const { user, logout, updateUserProfile } = useAuth();
  const { wallets, categories, transactions } = useFinance();
  const {
    currency,
    setCurrency,
    currencies,
    currencyName,
    usdToVndRate,
    setUsdToVndRate,
    DEFAULT_USD_TO_VND_RATE,
  } = useCurrency();
  const { language, setLanguage, t } = useLanguage();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [tempUsdRate, setTempUsdRate] = useState(usdToVndRate.toString());
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetSending, setResetSending] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [resetPassword, setResetPassword] = useState("");

  // Update tempUsdRate when usdToVndRate changes from outside
  useEffect(() => {
    setTempUsdRate(usdToVndRate.toString());
  }, [usdToVndRate]);

  // Initialize tempUsdRate when modal opens
  useEffect(() => {
    if (showCurrencyModal) {
      setTempUsdRate(usdToVndRate.toString());
    }
  }, [showCurrencyModal, usdToVndRate]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const fileInputRef = useRef(null);
  const [showHelpCenter, setShowHelpCenter] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || "Người dùng",
    email: user?.email || "user@example.com",
    avatar: user?.avatar || "",
  });

  // Sync profileData when user changes
  useEffect(() => {
    setProfileData({
      name: user?.name || t("user"),
      email: user?.email || "user@example.com",
      avatar: user?.avatar || "",
    });
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile(profileData);
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert(t("updateProfileError"));
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      name: user?.name || t("user"),
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
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert(t("avatarTooLarge") || "Kích thước ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert(t("pleaseSelectImage") || "Vui lòng chọn file ảnh");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader.result });
        setShowAvatarModal(false);
      };
      reader.onerror = () => {
        alert(t("errorReadingFile") || "Lỗi khi đọc file. Vui lòng thử lại.");
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
    setShowLanguageModal(false);
  };

  const handleLogout = () => {
    if (window.confirm(t("confirmLogout"))) {
      logout();
    }
  };

  const handleResetData = async () => {
    const confirmMessage = t("deleteDataWarning");
    
    const userInput = window.prompt(confirmMessage);
    
    if (userInput === t("deleteDataConfirmCode")) {
      try {
        console.log("🧹 Starting to delete all financial data...");
        await dataAPI.deleteAllData();
        
        // Clear all financial data from localStorage
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
        localStorage.removeItem("recurring_transactions");

        // Reset onboarding để hiển thị lại hướng dẫn
        localStorage.setItem("onboarding_completed", "false");
        localStorage.setItem("data_manually_cleared", "true");
        
        // Reset tour flags để chạy lại tour
        const userKey = (user?.id || user?._id || user?.email || "guest").toString();
        localStorage.removeItem(`tour_seen_once_${userKey}`);
        localStorage.removeItem("tour_dismissed");

        console.log("✅ All financial data cleared");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting data:", error);
        alert(t("deleteDataError"));
      }
    } else if (userInput !== null) {
      alert(t("deleteDataConfirmInvalid"));
    }
  };

  const accountSettings = [
    {
      icon: <User className="w-5 h-5" />,
      title: t("accountInformation"),
      subtitle: t("editPersonalInformation"),
      action: () => setIsEditingProfile(true),
    },
    {
      icon: <WalletIcon className="w-5 h-5" />,
      title: t("defaultWallet"),
      subtitle: currencyName,
      action: () => setShowCurrencyModal(true),
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: t("language"),
      subtitle: language === "vi" ? t("vietnamese") : t("english"),
      action: () => setShowLanguageModal(true),
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      title: language === "en" ? "Reset password" : "Đặt lại mật khẩu",
      subtitle: user?.email || "",
      action: () => setShowResetModal(true),
    },
  ];

  const helpSettings = [
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: t("contactUs"),
      subtitle: t("supportAndFeedback"),
      action: () => setShowContactModal(true),
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: t("userGuide"),
      subtitle: t("faqAndDocuments"),
      action: () => setShowHelpCenter(true),
    },
  ];

  const exportCSV = (rows, filename) => {
    if (!rows || rows.length === 0) {
      alert(t("noDataToExport"));
      return;
    }
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(",")].concat(
      rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(","))
    );
    const blob = new Blob(["\uFEFF" + csv.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Date range for report
  const [reportPreset, setReportPreset] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filterByPreset = (list) => {
    const now = new Date();
    let start = null;
    let end = null;
    if (reportPreset === "month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    } else if (reportPreset === "year") {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    } else if (reportPreset === "custom" && fromDate && toDate) {
      start = new Date(fromDate);
      end = new Date(new Date(toDate).setHours(23, 59, 59, 999));
    }
    if (!start || !end) return list;
    return list.filter((t) => {
      const d = new Date(t.date);
      return d >= start && d <= end;
    });
  };

  return (
    <div className="space-y-6 pt-4 max-w-7xl mx-auto px-4">
      {/* Profile Section - Top Row, Compact */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        {isEditingProfile ? (
          <div className="w-full space-y-4">
            {/* Avatar with Camera Button */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center">
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
                <button
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-lg"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-3 max-w-md mx-auto">
              <input
                type="text"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder={t("yourName")}
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
            <div className="flex gap-3 max-w-md mx-auto">
              <button
                onClick={handleSaveProfile}
                className="flex-1 px-4 py-3 bg-emerald-500 text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{t("saveButton")}</span>
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>{t("cancelButton")}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
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
                <div className="text-left flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-gray-800 truncate">
                    {profileData.name}
                  </h4>
                  <p className="text-gray-500 text-sm truncate">
                    {profileData.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingProfile(true)}
                className="text-emerald-600 text-sm font-medium flex items-center gap-1.5 hover:text-emerald-700 transition-colors px-4 py-2 rounded-lg hover:bg-emerald-50"
              >
                <Edit3 className="w-4 h-4" />
                <span>{t("edit")}</span>
              </button>
            </div>
        )}
      </div>

      {/* Main Content Grid - 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Dữ liệu & Sao lưu */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">{t("dataAndBackup")}</h3>
          </div>
          <div className="p-6 space-y-4">
            {/* Xóa dữ liệu - Nút nguy hiểm */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800 mb-1 flex items-center gap-2">
                    <Trash2 className="w-5 h-5" />
                    {t("deleteAllData")}
                  </h3>
                  <p className="text-sm text-red-700">
                    {t("deleteAllDataWarning")}
                  </p>
                </div>
              </div>
              <button
                onClick={handleResetData}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {t("deleteAllData")}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={reportPreset}
                onChange={(e) => setReportPreset(e.target.value)}
                className="border border-[#E6E8EB] rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="all">{t("all")}</option>
                <option value="month">{t("thisMonthOption")}</option>
                <option value="year">{t("thisYear")}</option>
                <option value="custom">{t("custom")}</option>
              </select>
              {reportPreset === "custom" && (
                <div className="flex items-center gap-2">
                  <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border border-[#E6E8EB] rounded-lg px-3 py-2 text-sm bg-white" />
                  <span className="text-sm text-gray-500">{t("to")}</span>
                  <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border border-[#E6E8EB] rounded-lg px-3 py-2 text-sm bg-white" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button onClick={() => exportCSV(transactions.map((t) => ({ id: t.id || t._id, type: t.type, amount: t.amount, date: t.date, category: t.category, wallet: t.wallet, note: t.note || "" })), "transactions.csv")} className="bg-[#1ABC9C] hover:bg-[#149D86] text-white font-medium px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
                <Download className="w-4 h-4" /> 
                <span className="truncate">{t("exportTransactions")}</span>
              </button>
              <button onClick={() => exportCSV(categories.map((c) => ({ id: c.id || c._id, name: c.name, type: c.type, group: c.group, budgetLimit: c.budgetLimit || 0, spent: c.spent || 0 })), "categories.csv")} className="bg-[#5DADE2] hover:bg-[#4A9BD0] text-white font-medium px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
                <FileSpreadsheet className="w-4 h-4" /> 
                <span className="truncate">{t("exportCategories")}</span>
              </button>
              <button onClick={() => exportCSV(wallets.map((w) => ({ id: w.id || w._id, name: w.name, balance: w.balance, icon: w.icon })), "wallets.csv")} className="bg-[#5DADE2] hover:bg-[#4A9BD0] text-white font-medium px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
                <FileSpreadsheet className="w-4 h-4" /> 
                <span className="truncate">{t("exportWallets")}</span>
              </button>
              <button onClick={() => { const tx = filterByPreset(transactions); const join = tx.map((t) => ({ Ngay: new Date(t.date).toISOString().slice(0, 10), SoTien: t.amount, Loai: t.type === "income" ? t("income") : t.type === "expense" ? t("expense") : t.type, DanhMuc: t.category, Vi: t.wallet, GhiChu: t.note || "" })); exportCSV(join, "report.csv"); }} className="bg-[#6C5CE7] hover:bg-[#5a4fcb] text-white font-medium px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
                <FileText className="w-4 h-4" /> 
                <span className="truncate">{t("exportReports")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="space-y-6">
          {/* Cài đặt */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">{t("settings")}</h3>
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
              <h3 className="text-lg font-semibold text-gray-800">{t("help")}</h3>
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
              <span>{t("logout")}</span>
            </button>
          </div>
        </div>

        <HelpCenterModal isOpen={showHelpCenter} onClose={() => setShowHelpCenter(false)} />

        {/* Export Section (legacy placement hidden) */}
        <div className="hidden bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Xuất dữ liệu</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <select
                value={reportPreset}
                onChange={(e) => setReportPreset(e.target.value)}
                className="border border-[#E6E8EB] rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="all">{t("all")}</option>
                <option value="month">{t("thisMonthOption")}</option>
                <option value="year">{t("thisYear")}</option>
                <option value="custom">{t("custom")}</option>
              </select>
              {reportPreset === "custom" && (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="border border-[#E6E8EB] rounded-lg px-3 py-2 text-sm bg-white"
                  />
                  <span className="text-sm text-gray-500">{t("to")}</span>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="border border-[#E6E8EB] rounded-lg px-3 py-2 text-sm bg-white"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <button
              onClick={() =>
                exportCSV(
                  transactions.map((t) => ({
                    id: t.id || t._id,
                    type: t.type,
                    amount: t.amount,
                    date: t.date,
                    category: t.category,
                    wallet: t.wallet,
                    note: t.note || "",
                  })),
                  "transactions.csv"
                )
              }
              className="bg-[#1ABC9C] hover:bg-[#149D86] text-white font-medium px-4 py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Xuất giao dịch (CSV)
            </button>
            <button
              onClick={() =>
                exportCSV(
                  categories.map((c) => ({
                    id: c.id || c._id,
                    name: c.name,
                    type: c.type,
                    group: c.group,
                    budgetLimit: c.budgetLimit || 0,
                    spent: c.spent || 0,
                  })),
                  "categories.csv"
                )
              }
              className="bg-[#5DADE2] hover:bg-[#4A9BD0] text-white font-medium px-4 py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" /> Xuất danh mục (CSV)
            </button>
            <button
              onClick={() =>
                exportCSV(
                  wallets.map((w) => ({
                    id: w.id || w._id,
                    name: w.name,
                    balance: w.balance,
                    icon: w.icon,
                  })),
                  "wallets.csv"
                )
              }
              className="bg-[#5DADE2] hover:bg-[#4A9BD0] text-white font-medium px-4 py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" /> Xuất ví (CSV)
            </button>
            <button
              onClick={() => {
                const tx = filterByPreset(transactions);
                const join = tx.map((t) => ({
                  Ngay: new Date(t.date).toISOString().slice(0, 10),
                  SoTien: t.amount,
                  Loai: t.type === "income" ? "Thu nhập" : t.type === "expense" ? "Chi tiêu" : t.type,
                  DanhMuc: t.category,
                  Vi: t.wallet,
                  GhiChu: t.note || "",
                }));
                exportCSV(join, "report.csv");
              }}
              className="bg-[#6C5CE7] hover:bg-[#5a4fcb] text-white font-medium px-4 py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" /> Xuất báo cáo đơn giản
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCurrencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[420px] rounded-2xl shadow-2xl max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-800">{t("selectCurrency")}</h2>
              <button
                onClick={() => setShowCurrencyModal(false)}
                className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-2 px-6 py-4 overflow-y-auto flex-1">
              {Object.entries(currencies).map(([code, currencyInfo]) => (
                <div key={code} className="space-y-2">
                  <button
                    onClick={() => {
                      setCurrency(code);
                      if (code === "USD") {
                        // Keep modal open to show exchange rate input
                      } else {
                        setShowCurrencyModal(false);
                      }
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
                  
                  {/* Exchange rate input for USD */}
                  {code === "USD" && currency === "USD" && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-2">
                      <label className="text-sm font-medium text-gray-700 block">
                        {t("exchangeRate")}
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={tempUsdRate}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || (parseFloat(value) > 0 && !isNaN(value))) {
                              setTempUsdRate(value);
                            }
                          }}
                          onBlur={() => {
                            const rate = parseFloat(tempUsdRate);
                            if (rate > 0 && !isNaN(rate)) {
                              setUsdToVndRate(rate);
                            } else {
                              setTempUsdRate(usdToVndRate.toString());
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800"
                          placeholder={DEFAULT_USD_TO_VND_RATE.toString()}
                        />
                        <span className="text-gray-600 font-medium">VND</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {t("default")} {DEFAULT_USD_TO_VND_RATE.toLocaleString()} VND
                      </p>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Close button when USD is selected */}
              {currency === "USD" && (
                <button
                  onClick={() => setShowCurrencyModal(false)}
                  className="w-full mt-4 bg-emerald-500 text-white py-3 rounded-xl font-medium hover:bg-emerald-600 transition-colors"
                >
                  {t("confirm")}
                </button>
              )}
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
              <h2 className="text-xl font-bold text-gray-800">{t("selectLanguage")}</h2>
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
                      {t("vietnamese")}
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

      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-800">{t("resetPassword") || "Đặt lại mật khẩu"}</h2>
              <button
                onClick={() => { setShowResetModal(false); setResetMessage(""); setResetError(""); setResetCode(""); setResetPassword(""); }}
                className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              {resetMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg">
                  {resetMessage}
                </div>
              )}
              {resetError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {resetError}
                </div>
              )}

              <button
                onClick={async () => {
                  setResetMessage("");
                  setResetError("");
                  try {
                    setResetSending(true);
                    const base = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
                    const res = await fetch(base + "/auth/forgot", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: user?.email }),
                    });
                    const data = await res.json().catch(() => ({}));
                    if (!res.ok) throw new Error(data.message || (t("sendCodeFailed") || "Gửi mã thất bại"));
                    setResetMessage(t("verificationCodeSent") || "Đã gửi mã xác thực về email. Vui lòng kiểm tra hộp thư.");
                  } catch (e) {
                    setResetError(e instanceof Error ? e.message : (t("somethingWentWrong") || "Có lỗi xảy ra"));
                  } finally {
                    setResetSending(false);
                  }
                }}
                disabled={resetSending}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resetSending ? (t("sendingCode") || "Đang gửi mã...") : (t("sendCodeToEmail") || "Gửi mã về email")}
              </button>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("verificationCode") || "Mã xác thực (6 số)"}</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="123456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("newPassword") || "Mật khẩu mới"}</label>
                  <input
                    type="password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                onClick={async () => {
                  setResetMessage("");
                  setResetError("");
                  try {
                    const base = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
                    const res = await fetch(base + "/auth/reset", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: user?.email, code: resetCode, newPassword: resetPassword }),
                    });
                    const data = await res.json().catch(() => ({}));
                    if (!res.ok) throw new Error(data.message || (t("resetPasswordFailed") || "Đặt lại mật khẩu thất bại"));
                    setResetMessage(t("resetPasswordSuccess") || "Đặt lại mật khẩu thành công.");
                  } catch (e) {
                    setResetError(e instanceof Error ? e.message : (t("somethingWentWrong") || "Có lỗi xảy ra"));
                  }
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-3 rounded-xl transition"
              >
                {t("confirmReset") || "Xác nhận đặt lại"}
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
