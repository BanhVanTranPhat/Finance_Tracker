import { useState } from "react";
import {
  Building2,
  CreditCard,
  Banknote,
  Coins,
  Target,
  Calendar,
  TrendingUp,
  TrendingDown,
  Folder,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowLeftRight,
  Zap,
} from "lucide-react";
import { useFinance } from "../contexts/FinanceContext.jsx";
import { formatDateForTransaction } from "../utils/dateFormatter.js";
import WalletManagementModal from "./WalletManagementModal.jsx";
import TransferMoneyModal from "./TransferMoneyModal.jsx";
import UpdateBalanceModal from "./UpdateBalanceModal.jsx";

// Mapping icon id to icon component (same as WalletManagementModal)
const iconMapping = {
  "money-bag": Banknote,
  "credit-card": CreditCard,
  bank: Building2,
  coins: Coins,
  target: Target,
  calendar: Calendar,
};

// Determine wallet type for subtitle based on chosen icon
const getWalletTypeLabel = (iconId) => {
  const map = {
    "money-bag": "Tiền mặt",
    "credit-card": "Thẻ ngân hàng",
    bank: "Ví điện tử",
    coins: "Vàng",
    target: "Thẻ tín dụng",
    calendar: "Các khoản vay",
  };
  return map[iconId] || "Tiền mặt";
};

export default function WalletScreen() {
  const {
    wallets,
    totalAssets,
    totalIncome,
    totalExpense,
    recentTransactions,
    deleteWallet,
  } = useFinance();

  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showUpdateBalanceModal, setShowUpdateBalanceModal] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [currentPage, setCurrentPage] = useState(0);
  const transactionsPerPage = 10;

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

  const handleDeleteWallet = async (wallet) => {
    const ok = window.confirm(
      `Xóa ví "${wallet.name}"? Hành động này không thể hoàn tác.`
    );
    if (!ok) return;
    try {
      await deleteWallet(wallet.id);
    } catch (e) {
      alert("Không thể xóa ví. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="pt-12 pb-6 px-4">
        <h1 className="text-2xl font-bold text-gray-800">Ví của tôi</h1>
      </div>

      {/* Total Assets Card */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="text-gray-600 text-sm mb-2 flex items-center">
            <span>Tổng tài sản</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-4">
            {totalAssets.toLocaleString()}₫
          </div>
          <div className="flex items-center justify-between text-sm text-gray-700">
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1 text-emerald-600" />
              <span>Thanh toán</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {totalAssets.toLocaleString()}₫
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-700 mt-2">
            <div className="flex items-center">
              <TrendingDown className="w-4 h-4 mr-1 text-red-600" />
              <span>Theo dõi</span>
            </div>
            <div className="text-lg font-bold text-gray-900">0₫</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleCreateWallet}
            className="flex flex-col items-center justify-center bg-indigo-500 rounded-2xl p-4 hover:bg-indigo-600 active:scale-95 transition-all shadow-md"
          >
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mb-2">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-white text-center">
              Tạo ví mới
            </span>
          </button>

          <button
            onClick={() => setShowTransferModal(true)}
            className="flex flex-col items-center justify-center bg-indigo-500 rounded-2xl p-4 hover:bg-indigo-600 active:scale-95 transition-all shadow-md"
          >
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mb-2">
              <ArrowLeftRight className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-white text-center">
              Chuyển tiền giữa các ví
            </span>
          </button>

          <button
            onClick={() => setShowUpdateBalanceModal(true)}
            className="flex flex-col items-center justify-center bg-indigo-500 rounded-2xl p-4 hover:bg-indigo-600 active:scale-95 transition-all shadow-md"
          >
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mb-2">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-white text-center">
              Cập nhật số dư nhanh
            </span>
          </button>
        </div>
      </div>

      {/* Wallet List */}
      <div className="px-4 mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            Ví thanh toán
          </h2>
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
            {wallets.map((wallet) => {
              // Get the icon component based on wallet.icon
              const IconComponent = iconMapping[wallet.icon] || Banknote;

              return (
                <div
                  key={wallet.id}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 ${wallet.color} rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-800 truncate">
                          {wallet.name}
                        </span>
                        {wallet.isDefault && (
                          <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{getWalletTypeLabel(wallet.icon)}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`font-bold text-base ${
                          wallet.balance >= 0 ? "text-gray-800" : "text-red-500"
                        }`}
                      >
                        {wallet.balance.toLocaleString()}₫
                      </div>
                      <button
                        onClick={() => handleEditWallet(wallet)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                        aria-label="Chỉnh sửa ví"
                        title="Chỉnh sửa ví"
                      >
                        <Edit2 className="w-5 h-5 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteWallet(wallet)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        aria-label="Xóa ví"
                        title="Xóa ví"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Giao dịch gần đây</h2>
          <div className="text-sm text-gray-500">
            {recentTransactions.length} giao dịch
          </div>
        </div>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-sm">Chưa có giao dịch nào</div>
            <div className="text-gray-300 text-xs mt-1">
              Thêm giao dịch để xem lịch sử
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {recentTransactions
                .slice(
                  currentPage * transactionsPerPage,
                  (currentPage + 1) * transactionsPerPage
                )
                .map((transaction) => {
                  const isIncome = transaction.type === "income";

                  return (
                    <div
                      key={transaction.id}
                      className={`rounded-xl p-4 shadow-sm border-l-4 ${
                        isIncome
                          ? "bg-emerald-50 border-emerald-500"
                          : "bg-red-50 border-red-500"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isIncome ? "bg-emerald-100" : "bg-red-100"
                          }`}
                        >
                          {isIncome ? (
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div
                            className={`font-semibold ${
                              isIncome ? "text-emerald-900" : "text-red-900"
                            }`}
                          >
                            {transaction.description || transaction.category}
                          </div>
                          <div className="text-sm text-gray-600">
                            {transaction.category} •{" "}
                            {formatDateForTransaction(transaction.date)}
                          </div>
                        </div>
                        <div
                          className={`font-bold text-lg ${
                            isIncome ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {transaction.amount.toLocaleString()}₫
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Pagination */}
            {recentTransactions.length > transactionsPerPage && (
              <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentPage === 0}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 0
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Quay lại</span>
                </button>
                <div className="text-sm text-gray-600">
                  Trang {currentPage + 1} /{" "}
                  {Math.ceil(recentTransactions.length / transactionsPerPage)}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        Math.ceil(
                          recentTransactions.length / transactionsPerPage
                        ) - 1,
                        prev + 1
                      )
                    )
                  }
                  disabled={
                    currentPage >=
                    Math.ceil(recentTransactions.length / transactionsPerPage) -
                      1
                  }
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${
                    currentPage >=
                    Math.ceil(recentTransactions.length / transactionsPerPage) -
                      1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  <span className="text-sm font-medium">Tiếp</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <WalletManagementModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSave={handleSaveWallet}
        editingWallet={editingWallet}
        mode={modalMode}
      />

      <TransferMoneyModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
      />

      <UpdateBalanceModal
        isOpen={showUpdateBalanceModal}
        onClose={() => setShowUpdateBalanceModal(false)}
      />
    </div>
  );
}
