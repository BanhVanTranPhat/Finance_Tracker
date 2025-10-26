import { useState, useEffect } from "react";
import { X, Target, Calendar, DollarSign, AlertCircle } from "lucide-react";

export default function GoalModal({
  isOpen,
  onClose,
  onSave,
  goal = null,
  mode = "create",
}) {
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    targetDate: "",
    category: "General",
    priority: "medium",
    description: "",
  });
  const [errors, setErrors] = useState({});

  const categories = [
    { value: "General", label: "Tổng quát" },
    { value: "Emergency", label: "Quỹ khẩn cấp" },
    { value: "Transportation", label: "Phương tiện" },
    { value: "Housing", label: "Nhà ở" },
    { value: "Education", label: "Giáo dục" },
    { value: "Health", label: "Sức khỏe" },
    { value: "Travel", label: "Du lịch" },
    { value: "Investment", label: "Đầu tư" },
  ];

  const priorities = [
    { value: "low", label: "Thấp", color: "text-green-600" },
    { value: "medium", label: "Trung bình", color: "text-yellow-600" },
    { value: "high", label: "Cao", color: "text-red-600" },
  ];

  useEffect(() => {
    if (goal && mode === "edit") {
      setFormData({
        title: goal.title || "",
        targetAmount: goal.targetAmount?.toString() || "",
        targetDate: goal.targetDate || "",
        category: goal.category || "General",
        priority: goal.priority || "medium",
        description: goal.description || "",
      });
    } else {
      setFormData({
        title: "",
        targetAmount: "",
        targetDate: "",
        category: "General",
        priority: "medium",
        description: "",
      });
    }
    setErrors({});
  }, [goal, mode, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tên mục tiêu không được để trống";
    }

    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = "Số tiền mục tiêu phải lớn hơn 0";
    }

    if (!formData.targetDate) {
      newErrors.targetDate = "Ngày mục tiêu không được để trống";
    } else {
      const targetDate = new Date(formData.targetDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (targetDate < today) {
        newErrors.targetDate = "Ngày mục tiêu không được là ngày trong quá khứ";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const goalData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
      };

      onSave(goalData);
      onClose();
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-800">
              {mode === "create" ? "Tạo mục tiêu mới" : "Chỉnh sửa mục tiêu"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên mục tiêu *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ví dụ: Mua xe máy, Quỹ khẩn cấp..."
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số tiền mục tiêu (₫) *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={formData.targetAmount}
                onChange={(e) =>
                  handleInputChange("targetAmount", e.target.value)
                }
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.targetAmount ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="10000000"
                min="1"
              />
            </div>
            {errors.targetAmount && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.targetAmount}
              </p>
            )}
          </div>

          {/* Target Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày mục tiêu *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) =>
                  handleInputChange("targetDate", e.target.value)
                }
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.targetDate ? "border-red-500" : "border-gray-300"
                }`}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            {errors.targetDate && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.targetDate}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mức độ ưu tiên
            </label>
            <div className="grid grid-cols-3 gap-2">
              {priorities.map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => handleInputChange("priority", priority.value)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    formData.priority === priority.value
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className={priority.color}>{priority.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả (tùy chọn)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows="3"
              placeholder="Mô tả chi tiết về mục tiêu của bạn..."
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              {mode === "create" ? "Tạo mục tiêu" : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
