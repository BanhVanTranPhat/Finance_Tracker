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
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
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

export default function WalletScreenDesktop() {
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
        <div className="bg-white rounded-2xl p-6 border border-gray-200 text-gray-900">
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2 flex items-center">
              <span>Tổng tài sản</span>
            </div>
            <div className="text-3xl font-bold mb-4">
              {totalAssets.toLocaleString()}₫
            </div>
          </div>
          <div className="flex items-center justify-between text-sm mb-2 text-gray-700">
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1 text-emerald-600" />
              <span>Thanh toán</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {totalAssets.toLocaleString()}₫
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-700">
            <div className="flex items-center">
              <TrendingDown className="w-4 h-4 mr-1 text-red-600" />
              <span>Theo dõi</span>
            </div>
            <div className="text-lg font-bold text-gray-900">0₫</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <button
            onClick={handleCreateWallet}
            className="flex flex-col items-center justify-center bg-indigo-500 rounded-2xl p-6 hover:bg-indigo-600 active:scale-95 transition-all shadow-md"
          >
            <div className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center mb-3">
              <Plus className="w-7 h-7 text-white" />
            </div>
            <span className="text-sm font-medium text-white text-center">
              Tạo ví mới
            </span>
          </button>

          <button
            onClick={() => setShowTransferModal(true)}
            className="flex flex-col items-center justify-center bg-indigo-500 rounded-2xl p-6 hover:bg-indigo-600 active:scale-95 transition-all shadow-md"
          >
            <div className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center mb-3">
              <ArrowLeftRight className="w-7 h-7 text-white" />
            </div>
            <span className="text-sm font-medium text-white text-center">
              Chuyển tiền giữa các ví
            </span>
          </button>

          <button
            onClick={() => setShowUpdateBalanceModal(true)}
            className="flex flex-col items-center justify-center bg-indigo-500 rounded-2xl p-6 hover:bg-indigo-600 active:scale-95 transition-all shadow-md"
          >
            <div className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center mb-3">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <span className="text-sm font-medium text-white text-center">
              Cập nhật số dư nhanh
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column - Wallets */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Ví thanh toán
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
              {wallets.map((wallet) => {
                // Get the icon component based on wallet.icon
                const IconComponent = iconMapping[wallet.icon] || Banknote;

                return (
                  <div
                    key={wallet.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div
                          className={`w-10 h-10 ${wallet.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                        >
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-800 truncate">
                              {wallet.name}
                            </h4>
                            {wallet.isDefault && (
                              <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{getWalletTypeLabel(wallet.icon)}</p>
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Giao dịch gần đây
              </h3>
              <div className="text-sm text-gray-500">
                {recentTransactions.length} giao dịch
              </div>
            </div>
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
                          className={`flex items-center space-x-3 p-3 rounded-lg border-l-4 transition-all hover:shadow-md ${
                            isIncome
                              ? "bg-emerald-50 border-emerald-500 hover:bg-emerald-100"
                              : "bg-red-50 border-red-500 hover:bg-red-100"
                          }`}
                        >
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
                      );
                    })}
                </div>

                {/* Pagination */}
                {recentTransactions.length > transactionsPerPage && (
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(0, prev - 1))
                      }
                      disabled={currentPage === 0}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === 0
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Quay lại</span>
                    </button>
                    <div className="text-sm text-gray-600 font-medium">
                      Trang {currentPage + 1} /{" "}
                      {Math.ceil(
                        recentTransactions.length / transactionsPerPage
                      )}
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
                        Math.ceil(
                          recentTransactions.length / transactionsPerPage
                        ) -
                          1
                      }
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage >=
                        Math.ceil(
                          recentTransactions.length / transactionsPerPage
                        ) -
                          1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      <span>Tiếp</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
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
