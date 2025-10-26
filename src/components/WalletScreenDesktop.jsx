import { useState } from "react";
import {
  Building2,
  TrendingUp,
  TrendingDown,
  Folder,
  Plus,
  Edit2,
} from "lucide-react";
import { useFinance } from "../contexts/FinanceContext.jsx";
import { formatDateForTransaction } from "../utils/dateFormatter.js";
import WalletManagementModal from "./WalletManagementModal.jsx";

export default function WalletScreenDesktop() {
  const {
    wallets,
    totalAssets,
    totalIncome,
    totalExpense,
    recentTransactions,
  } = useFinance();

  const [showWalletModal, setShowWalletModal] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [modalMode, setModalMode] = useState("create");

  const handleEditWallet = (wallet) => {
    setEditingWallet(wallet);
    setModalMode("edit");
    setShowWalletModal(true);
  };

  const handleCreateWallet = () => {
    setEditingWallet(null);
    setModalMode("create");
    setShowWalletModal(true);
  };

  const handleSaveWallet = () => {
    setShowWalletModal(false);
    setEditingWallet(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý ví</h1>
            <p className="text-gray-600 mt-1">
              Theo dõi và quản lý các ví tiền của bạn
            </p>
          </div>
          <button
            onClick={handleCreateWallet}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo ví mới</span>
          </button>
        </div>

        {/* Total Assets */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium opacity-90">Tổng tài sản</h3>
              <p className="text-3xl font-bold">
                {totalAssets.toLocaleString()}₫
              </p>
            </div>
            <Building2 className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column - Wallets */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Danh sách ví
          </h3>
          {wallets.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">Chưa có ví nào</p>
              <p className="text-sm text-gray-400 mb-4">
                Tạo ví để bắt đầu quản lý tài chính
              </p>
              <button
                onClick={handleCreateWallet}
                className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Tạo ví đầu tiên
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {wallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 ${wallet.color} rounded-lg flex items-center justify-center`}
                      >
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {wallet.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {wallet.isDefault ? "Ví mặc định" : "Ví phụ"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-800">
                          {wallet.balance.toLocaleString()}₫
                        </p>
                      </div>
                      <button
                        onClick={() => handleEditWallet(wallet)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Chỉnh sửa ví"
                        title="Chỉnh sửa ví"
                      >
                        <Edit2 className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Financial Overview */}
        <div className="space-y-6">
          {/* Income/Expense Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-500 rounded-xl p-4 text-white">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6" />
                <div>
                  <div className="text-sm opacity-90">Thu nhập</div>
                  <div className="text-xl font-bold">
                    {totalIncome.toLocaleString()}₫
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-red-500 rounded-xl p-4 text-white">
              <div className="flex items-center space-x-3">
                <TrendingDown className="w-6 h-6" />
                <div>
                  <div className="text-sm opacity-90">Chi tiêu</div>
                  <div className="text-xl font-bold">
                    {totalExpense.toLocaleString()}₫
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Giao dịch gần đây
            </h3>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Folder className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-gray-500 mb-2">Chưa có giao dịch nào</div>
                <div className="text-sm text-gray-400">
                  Thêm giao dịch để xem lịch sử
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center">
                      <Folder className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {transaction.description || transaction.category}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.category} •{" "}
                        {formatDateForTransaction(transaction.date)}
                      </div>
                    </div>
                    <div
                      className={`font-bold ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {transaction.amount.toLocaleString()}₫
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wallet Modal */}
      {showWalletModal && (
        <WalletManagementModal
          isOpen={showWalletModal}
          onClose={() => setShowWalletModal(false)}
          onSave={handleSaveWallet}
          editWallet={editingWallet}
          mode={modalMode}
        />
      )}
    </div>
  );
}
