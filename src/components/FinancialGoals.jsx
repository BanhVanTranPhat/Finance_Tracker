import { useState } from "react";
import {
  Target,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useGoal } from "../contexts/GoalContext.jsx";
import GoalModal from "./GoalModal.jsx";
import ProgressBar from "./ProgressBar.jsx";

export default function FinancialGoals() {
  const {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalProgress,
    getDaysRemaining,
    getActiveGoals,
    getTotalProgress,
    getTotalTargetAmount,
    getTotalCurrentAmount,
  } = useGoal();

  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [modalMode, setModalMode] = useState("create");

  const activeGoals = getActiveGoals();
  const totalProgress = getTotalProgress();
  const totalTarget = getTotalTargetAmount();
  const totalCurrent = getTotalCurrentAmount();

  const handleCreateGoal = () => {
    setEditingGoal(null);
    setModalMode("create");
    setShowModal(true);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleSaveGoal = (goalData) => {
    if (modalMode === "create") {
      addGoal(goalData);
    } else {
      updateGoal(editingGoal.id, goalData);
    }
  };

  const handleDeleteGoal = (goalId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mục tiêu này?")) {
      deleteGoal(goalId);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "high":
        return "Cao";
      case "medium":
        return "Trung bình";
      case "low":
        return "Thấp";
      default:
        return "Không xác định";
    }
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-emerald-800">
            Mục tiêu tài chính
          </h3>
        </div>
        <button
          onClick={handleCreateGoal}
          className="flex items-center space-x-1 px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Tạo mục tiêu</span>
        </button>
      </div>

      {/* Overall Progress */}
      {activeGoals.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Tổng tiến độ
            </span>
            <span className="text-sm font-bold text-emerald-600">
              {totalProgress.toFixed(1)}%
            </span>
          </div>
          <ProgressBar progress={totalProgress} />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{formatCurrency(totalCurrent)}₫</span>
            <span>{formatCurrency(totalTarget)}₫</span>
          </div>
        </div>
      )}

      {/* Goals List */}
      {activeGoals.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-2">Chưa có mục tiêu nào</p>
          <p className="text-sm text-gray-400 mb-6">
            Tạo mục tiêu để theo dõi tiến độ tiết kiệm
          </p>
          <button
            onClick={handleCreateGoal}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Tạo mục tiêu đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {activeGoals.map((goal) => {
            const progress = getGoalProgress(goal);
            const daysRemaining = getDaysRemaining(goal.targetDate);
            const isOverdue = daysRemaining < 0;
            const isCompleted = progress >= 100;

            return (
              <div
                key={goal.id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                {/* Goal Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-800">
                        {goal.title}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          goal.priority
                        )}`}
                      >
                        {getPriorityLabel(goal.priority)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{goal.category}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditGoal(goal)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Edit3 className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Tiến độ
                    </span>
                    <span className="text-sm font-bold text-emerald-600">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <ProgressBar progress={progress} />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formatCurrency(goal.currentAmount)}₫</span>
                    <span>{formatCurrency(goal.targetAmount)}₫</span>
                  </div>
                </div>

                {/* Goal Details */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(goal.targetDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : isOverdue ? (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-500" />
                      )}
                      <span
                        className={
                          isCompleted
                            ? "text-green-600 font-medium"
                            : isOverdue
                            ? "text-red-600 font-medium"
                            : "text-yellow-600 font-medium"
                        }
                      >
                        {isCompleted
                          ? "Hoàn thành"
                          : isOverdue
                          ? `Quá hạn ${Math.abs(daysRemaining)} ngày`
                          : `Còn ${daysRemaining} ngày`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-emerald-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">
                      {formatCurrency(goal.targetAmount - goal.currentAmount)}₫
                    </span>
                  </div>
                </div>

                {/* Description */}
                {goal.description && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Goal Modal */}
      <GoalModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveGoal}
        goal={editingGoal}
        mode={modalMode}
      />
    </div>
  );
}
