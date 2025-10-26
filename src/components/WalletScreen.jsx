import { useState } from "react";
import {
  Building2,
  TrendingUp,
  TrendingDown,
  Folder,
  Edit2,
} from "lucide-react";
import { useFinance } from "../contexts/FinanceContext.jsx";
import { formatDateForTransaction } from "../utils/dateFormatter.js";
import WalletManagementModal from "./WalletManagementModal.jsx";

export default function WalletScreen() {
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="pt-12 pb-6 px-4">
        <h1 className="text-2xl font-bold text-gray-800">Ví của tôi</h1>
      </div>

      {/* Total Assets Card */}
      <div className="px-4 mb-6">
        <div className="bg-gray-800 rounded-2xl p-6">
          <div className="text-white text-sm mb-2">Tổng tài sản</div>
          <div className="text-3xl font-bold text-white mb-4">
            {totalAssets.toLocaleString()}₫
          </div>
          <div className="flex items-center space-x-4 text-sm text-white">
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Thu: {totalIncome.toLocaleString()}₫</span>
            </div>
            <div className="flex items-center">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span>Chi: {totalExpense.toLocaleString()}₫</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet List */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Danh sách ví</h2>
          <button
            onClick={handleCreateWallet}
            className="text-emerald-600 font-medium"
          >
            + Thêm ví
          </button>
        </div>
        {wallets.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-sm mb-2">Chưa có ví nào</div>
            <div className="text-gray-300 text-xs">
              Tạo ví đầu tiên để bắt đầu quản lý tài chính
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 ${wallet.color} rounded-full flex items-center justify-center`}
                  >
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {wallet.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {wallet.isDefault ? "Ví mặc định" : "Ví phụ"}
                    </div>
                  </div>
                  <div
                    className={`font-bold ${
                      wallet.balance >= 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {wallet.balance.toLocaleString()}₫
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
            ))}
          </div>
        )}
      </div>

      {/* Wallet Management Modal */}
      {showWalletModal && (
        <WalletManagementModal
          isOpen={showWalletModal}
          onClose={() => setShowWalletModal(false)}
          onSave={handleSaveWallet}
          editWallet={editingWallet}
          mode={modalMode}
        />
      )}

      {/* Recent Transactions */}
      <div className="px-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Giao dịch gần đây
        </h2>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-sm">Chưa có giao dịch nào</div>
            <div className="text-gray-300 text-xs mt-1">
              Thêm giao dịch để xem lịch sử
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center space-x-3">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
