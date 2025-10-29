import { useState } from "react";
import {
  Search,
  Filter,
  Edit3,
  Trash2,
  Calendar,
  Wallet,
  Folder,
  ArrowUp,
  ArrowDown,
  MoreVertical,
} from "lucide-react";
import { useFinance } from "../contexts/FinanceContext.jsx";
import { formatDate } from "../utils/dateFormatter.js";
import TransactionModal from "./TransactionModal.jsx";

export default function TransactionListCRUD() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useFinance();
  const [showModal, setShowModal] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesSearch =
        transaction.category
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.wallet?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        filterType === "all" || transaction.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = (a.category || "").localeCompare(b.category || "");
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const handleEditTransaction = (transaction) => {
    setEditTransaction(transaction);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleSaveTransaction = async (transactionData) => {
    try {
      await addTransaction(transactionData);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const handleUpdateTransaction = async (id, transactionData) => {
    try {
      await updateTransaction(id, transactionData);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN") + "₫";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl sm:p-6 p-0 sm:shadow-sm shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4 pt-4 sm:px-0 sm:pt-0">
        <h3 className="text-xl font-bold text-gray-800">
          Giao dịch ({filteredTransactions.length})
        </h3>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3 mb-4 px-4 sm:px-0">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm giao dịch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-1">
          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="flex-shrink-0 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-medium bg-white min-w-[110px]"
          >
            <option value="all">Tất cả</option>
            <option value="income">Thu nhập</option>
            <option value="expense">Chi tiêu</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-shrink-0 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-medium bg-white min-w-[140px]"
          >
            <option value="date">Theo ngày</option>
            <option value="amount">Theo số tiền</option>
            <option value="category">Theo danh mục</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex-shrink-0 w-12 h-12 border-2 border-gray-200 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-all active:scale-95 flex items-center justify-center"
            aria-label={
              sortOrder === "asc" ? "Sắp xếp tăng dần" : "Sắp xếp giảm dần"
            }
          >
            {sortOrder === "asc" ? (
              <ArrowUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ArrowDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-2 px-4 sm:px-0">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-1">
              Chưa có giao dịch nào
            </p>
            <p className="text-sm text-gray-400">
              Nhấn nút "+" ở giữa bottom navigation để thêm giao dịch đầu tiên
            </p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction._id || transaction.id}
              className={`rounded-xl p-4 transition-all ${
                transaction.type === "income"
                  ? "bg-green-50/70 border-l-4 border-green-500"
                  : "bg-red-50/70 border-l-4 border-red-500"
              }`}
            >
              <div className="flex items-start justify-between">
                {/* Left side - Icon and Info */}
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                      transaction.type === "income"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUp className="w-5 h-5" />
                    ) : (
                      <ArrowDown className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Title and Type */}
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-bold text-gray-800 text-base truncate">
                        {transaction.category || "Không có danh mục"}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          transaction.type === "income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {transaction.type === "income"
                          ? "Thu nhập"
                          : "Chi tiêu"}
                      </span>
                    </div>

                    {/* Wallet and Date */}
                    <div className="flex flex-col space-y-1 text-xs text-gray-600 mb-1">
                      <div className="flex items-center space-x-1">
                        <Folder className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">
                          {transaction.wallet || "Không có ví"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{formatDate(transaction.date)}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {transaction.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {transaction.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right side - Amount and Actions */}
                <div className="flex flex-col items-end space-y-2 ml-3">
                  <div
                    className={`text-base font-bold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditTransaction(transaction)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-95"
                      aria-label="Chỉnh sửa giao dịch"
                      title="Chỉnh sửa giao dịch"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteTransaction(
                          transaction._id || transaction.id
                        )
                      }
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-95"
                      aria-label="Xóa giao dịch"
                      title="Xóa giao dịch"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveTransaction}
        onUpdate={handleUpdateTransaction}
        onDelete={handleDeleteTransaction}
        editTransaction={editTransaction}
        mode={modalMode}
        initialType={editTransaction?.type || "expense"}
      />
    </div>
  );
}
