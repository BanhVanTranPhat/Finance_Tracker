import { useState } from "react";
import {
  Plus,
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
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.wallet.toLowerCase().includes(searchTerm.toLowerCase());
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
          comparison = a.category.localeCompare(b.category);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const handleAddTransaction = () => {
    setEditTransaction(null);
    setModalMode("add");
    setShowModal(true);
  };

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
    <div className="bg-white rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Giao dịch ({filteredTransactions.length})
        </h3>
        <button
          onClick={handleAddTransaction}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm giao dịch</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm giao dịch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex space-x-2">
          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Tất cả</option>
            <option value="income">Thu nhập</option>
            <option value="expense">Chi tiêu</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="date">Sắp xếp theo ngày</option>
            <option value="amount">Sắp xếp theo số tiền</option>
            <option value="category">Sắp xếp theo danh mục</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1"
          >
            {sortOrder === "asc" ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
            <span>{sortOrder === "asc" ? "Tăng dần" : "Giảm dần"}</span>
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">Chưa có giao dịch nào</p>
            <p className="text-sm text-gray-400 mb-4">
              Thêm giao dịch đầu tiên để bắt đầu theo dõi tài chính
            </p>
            <button
              onClick={handleAddTransaction}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Thêm giao dịch
            </button>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === "income"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-800">
                          {transaction.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {transaction.type === "income"
                            ? "Thu nhập"
                            : "Chi tiêu"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Wallet className="w-3 h-3" />
                          <span>{transaction.wallet}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(transaction.date)}</span>
                        </div>
                      </div>
                      {transaction.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {transaction.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditTransaction(transaction)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      aria-label="Chỉnh sửa giao dịch"
                      title="Chỉnh sửa giao dịch"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
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
