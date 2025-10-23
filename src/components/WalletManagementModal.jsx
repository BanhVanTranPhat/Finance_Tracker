import { useState } from "react";
import {
  X,
  Building2,
  CreditCard,
  Banknote,
  Coins,
  Target,
  Calendar,
} from "lucide-react";
import { useFinance } from "../contexts/FinanceContext.jsx";

const walletIcons = [
  { id: "money-bag", icon: Banknote, color: "bg-yellow-500" },
  { id: "credit-card", icon: CreditCard, color: "bg-blue-500" },
  { id: "bank", icon: Building2, color: "bg-purple-500" },
  { id: "coins", icon: Coins, color: "bg-yellow-600" },
  { id: "target", icon: Target, color: "bg-red-500" },
  { id: "calendar", icon: Calendar, color: "bg-green-500" },
];

export default function WalletManagementModal({ isOpen, onClose, onSave }) {
  const { addWallet } = useFinance();
  const [selectedIcon, setSelectedIcon] = useState("money-bag");
  const [walletName, setWalletName] = useState("");
  const [balance, setBalance] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const handleSave = async () => {
    if (!walletName.trim()) return;

    const walletData = {
      name: walletName,
      balance: parseFloat(balance) || 0,
      icon: selectedIcon,
      color:
        walletIcons.find((icon) => icon.id === selectedIcon)?.color ||
        "bg-yellow-500",
      isDefault,
    };

    await addWallet(walletData);
    onSave(walletData);
    onClose();

    // Reset form
    setWalletName("");
    setBalance("");
    setIsDefault(false);
    setSelectedIcon("money-bag");
  };

  if (!isOpen) return null;

  const selectedIconData = walletIcons.find((icon) => icon.id === selectedIcon);
  const SelectedIconComponent = selectedIconData?.icon || Banknote;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-white w-full h-[90vh] rounded-t-3xl p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-emerald-800">
            Tạo ví thanh toán
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
            aria-label="Đóng modal"
            title="Đóng modal"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Icon Selection */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <SelectedIconComponent className="w-10 h-10 text-white" />
          </div>
          <button className="bg-yellow-400 text-emerald-800 px-4 py-2 rounded-lg font-medium">
            Thay đổi biểu tượng
          </button>
        </div>

        {/* Icon Grid */}
        <div className="grid grid-cols-6 gap-3 mb-6">
          {walletIcons.map((iconData) => {
            const IconComponent = iconData.icon;
            const isSelected = selectedIcon === iconData.id;
            return (
              <button
                key={iconData.id}
                onClick={() => setSelectedIcon(iconData.id)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  isSelected
                    ? "bg-emerald-600"
                    : `${iconData.color} bg-opacity-20 hover:bg-opacity-30`
                }`}
                aria-label={`Chọn icon ${iconData.id}`}
                title={`Chọn icon ${iconData.id}`}
              >
                <IconComponent
                  className={`w-6 h-6 ${
                    isSelected ? "text-white" : "text-gray-600"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Wallet Name Input */}
        <div className="mb-6">
          <label className="block text-emerald-800 font-semibold mb-2">
            Tên của ví này
          </label>
          <input
            type="text"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
            placeholder="bank techcom"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>

        {/* Balance Input */}
        <div className="mb-6">
          <label className="block text-emerald-800 font-semibold mb-2">
            Hiện tại số dư trong ví của bạn là bao nhiêu?
          </label>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="đ 0"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
          <p className="text-gray-500 text-sm mt-2">
            Bạn nhập số tiền càng chính xác thì chúng tôi có thể giúp bạn cập
            nhật ngân sách càng chính xác hơn.
          </p>
        </div>

        {/* Default Wallet Toggle */}
        <div className="mb-8">
          <h3 className="text-emerald-800 font-semibold mb-2">Ví mặc định</h3>
          <p className="text-gray-600 text-sm mb-4">
            Ví mặc định là ví sẽ được mặc định lựa chọn khi bạn tạo các giao
            dịch.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Đặt làm ví mặc định</span>
            <button
              onClick={() => setIsDefault(!isDefault)}
              className={`w-12 h-6 rounded-full transition-colors ${
                isDefault ? "bg-emerald-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  isDefault ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-yellow-400 text-emerald-800 font-bold py-4 rounded-xl hover:bg-yellow-500 transition-colors"
          aria-label="Lưu ví mới"
          title="Lưu ví mới"
        >
          LƯU VÍ
        </button>
      </div>
    </div>
  );
}
