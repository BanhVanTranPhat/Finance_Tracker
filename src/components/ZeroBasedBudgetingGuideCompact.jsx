import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Play,
  RotateCcw,
  Target,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import ProgressBar from "./ProgressBar.jsx";

export default function ZeroBasedBudgetingGuideCompact() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const steps = [
    {
      id: 1,
      title: "Nhận lương",
      description: "Bạn nhận được 10 triệu lương",
      unallocated: 10000000,
      allocated: 0,
    },
    {
      id: 2,
      title: "Phân bổ cho Trả tiền nhà",
      amount: 3000000,
      unallocated: 7000000,
      allocated: 3000000,
    },
    {
      id: 3,
      title: "Phân bổ cho Ăn uống",
      amount: 2000000,
      unallocated: 5000000,
      allocated: 5000000,
    },
    {
      id: 4,
      title: "Phân bổ cho Tiết kiệm",
      amount: 3000000,
      unallocated: 2000000,
      allocated: 8000000,
    },
    {
      id: 5,
      title: "Phân bổ cho Giải trí",
      amount: 2000000,
      unallocated: 0,
      allocated: 10000000,
    },
  ];

  const handleRun = () => {
    setIsRunning(true);
    setCurrentStep(0);
    const runSteps = () => {
      if (currentStep < steps.length) {
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
          runSteps();
        }, 1500);
      } else {
        setIsRunning(false);
      }
    };
    runSteps();
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsRunning(false);
  };

  const currentData = steps[currentStep] || steps[0];

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center text-sm font-medium text-gray-700 mb-2"
        aria-expanded={isExpanded}
        aria-controls="zbb-compact-content"
      >
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          <span>Hướng dẫn Zero-Based Budgeting</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div
          id="zbb-compact-content"
          className="text-gray-700 text-sm space-y-4"
        >
          {/* Triết lý ngắn gọn */}
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-semibold text-blue-800 mb-2">
              Triết lý "Giao việc cho tiền"
            </h4>
            <p className="text-xs text-blue-700">
              Mỗi đồng tiền cần được "giao việc" cụ thể trước khi bạn chi tiêu.
            </p>
          </div>

          {/* Ví dụ tương tác */}
          <div className="bg-green-50 rounded-lg p-3">
            <h4 className="font-semibold text-green-800 mb-3">
              Ví dụ "Giao việc" cho 10 triệu lương
            </h4>

            {/* Controls */}
            <div className="flex space-x-2 mb-4">
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center space-x-1"
              >
                <Play className="w-3 h-3" />
                <span>Chạy</span>
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1 bg-gray-500 text-white text-xs rounded-lg hover:bg-gray-600 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Current Step Display */}
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">
                  Bước {currentData.id}: {currentData.title}
                </span>
                {currentData.amount && (
                  <span className="text-green-600 font-bold">
                    {currentData.amount.toLocaleString()}₫
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3 text-orange-500" />
                  <span className="text-gray-600">Còn lại: </span>
                  <span className="font-bold text-orange-600">
                    {currentData.unallocated.toLocaleString()}₫
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-gray-600">Đã phân bổ: </span>
                  <span className="font-bold text-green-600">
                    {currentData.allocated.toLocaleString()}₫
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Tiến độ phân bổ</span>
                <span>
                  {Math.round((currentData.allocated / 10000000) * 100)}%
                </span>
              </div>
              <ProgressBar value={currentData.allocated} max={10000000} />
            </div>
          </div>

          {/* Phân biệt Phân bổ vs Chi tiêu */}
          <div className="bg-yellow-50 rounded-lg p-3">
            <h4 className="font-semibold text-yellow-800 mb-2">
              Phân biệt "Phân bổ" và "Chi tiêu"
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-2 rounded border border-yellow-200">
                <div className="flex items-center space-x-1 mb-1">
                  <Target className="w-3 h-3 text-blue-500" />
                  <span className="font-medium text-gray-800">
                    Phân bổ (Kế hoạch)
                  </span>
                </div>
                <ul className="space-y-1 text-yellow-700">
                  <li>• Không làm giảm tiền</li>
                  <li>• Chỉ là kế hoạch</li>
                  <li>• Có thể thay đổi</li>
                  <li>• Mục tiêu: Giao việc cho tiền</li>
                </ul>
              </div>
              <div className="bg-white p-2 rounded border border-yellow-200">
                <div className="flex items-center space-x-1 mb-1">
                  <DollarSign className="w-3 h-3 text-red-500" />
                  <span className="font-medium text-gray-800">
                    Chi tiêu (Thực tế)
                  </span>
                </div>
                <ul className="space-y-1 text-yellow-700">
                  <li>• Làm giảm tiền</li>
                  <li>• Là thực tế</li>
                  <li>• Không thể hoàn tác</li>
                  <li>• Kết quả: Sử dụng tiền</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Lưu ý quan trọng */}
          <div className="bg-red-50 rounded-lg p-3">
            <h4 className="font-semibold text-red-800 mb-2">
              ⚠️ Lưu ý quan trọng
            </h4>
            <div className="space-y-1 text-xs text-red-700">
              <p>
                <strong>• Phân bổ ≠ Chi tiêu:</strong> Khi bạn phân bổ 2 triệu
                vào "Ăn uống", đó chưa phải là chi tiêu. Đó chỉ là kế hoạch.
              </p>
              <p>
                <strong>• Chi tiêu thực tế:</strong> Khi bạn đi ăn phở 50,000₫
                và ghi chép vào app, thì 50,000₫ đó mới thực sự trở thành chi
                tiêu.
              </p>
              <p>
                <strong>• Mục tiêu:</strong> Đưa "Tiền chưa có việc" về 0 bằng
                cách phân bổ hết vào các danh mục.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
