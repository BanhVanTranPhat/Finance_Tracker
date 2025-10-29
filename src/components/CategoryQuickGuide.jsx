import { useState } from "react";
import { ChevronDown, ChevronUp, Lightbulb, Target, Plus } from "lucide-react";

export default function CategoryQuickGuide() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              💡 Mẹo tạo danh mục hiệu quả
            </h3>
            <p className="text-xs text-gray-600">
              Hướng dẫn tạo danh mục để quản lý chi tiêu hiệu quả
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Nguyên tắc cơ bản */}
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Nguyên tắc cơ bản</span>
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                <strong>Mỗi đồng tiền có một "việc":</strong> Tạo danh mục cho
                mọi khoản chi tiêu
              </li>
              <li>
                <strong>Phân nhóm rõ ràng:</strong> Nhóm các danh mục liên quan
                lại với nhau
              </li>
              <li>
                <strong>Linh hoạt:</strong> Có thể thêm/sửa/xóa danh mục bất kỳ
                lúc nào
              </li>
            </ul>
          </div>

          {/* Gợi ý danh mục */}
          <div className="bg-green-50 rounded-lg p-3">
            <h4 className="font-medium text-green-800 mb-2">
              Gợi ý danh mục phổ biến
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="space-y-1">
                <div className="font-medium text-green-700">
                  Chi phí bắt buộc:
                </div>
                <div className="text-green-600">• Tiền nhà</div>
                <div className="text-green-600">• Hóa đơn</div>
                <div className="text-green-600">• Ăn uống</div>
                <div className="text-green-600">• Đi lại</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-green-700">
                  Chi phí linh hoạt:
                </div>
                <div className="text-green-600">• Giải trí</div>
                <div className="text-green-600">• Shopping</div>
                <div className="text-green-600">• Du lịch</div>
                <div className="text-green-600">• Tiết kiệm</div>
              </div>
            </div>
          </div>

          {/* Cách sử dụng */}
          <div className="bg-yellow-50 rounded-lg p-3">
            <h4 className="font-medium text-yellow-800 mb-2">
              Cách sử dụng danh mục
            </h4>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>
                <strong>1. Tạo danh mục:</strong> Nhấn nút "Tạo danh mục mới"
              </p>
              <p>
                <strong>2. Phân bổ ngân sách:</strong> Gán số tiền cho từng danh
                mục
              </p>
              <p>
                <strong>3. Chi tiêu:</strong> Khi chi tiêu, chọn danh mục tương
                ứng
              </p>
              <p>
                <strong>4. Theo dõi:</strong> Xem báo cáo chi tiêu theo danh mục
              </p>
            </div>
          </div>

          {/* Lưu ý */}
          <div className="bg-orange-50 rounded-lg p-3">
            <h4 className="font-medium text-orange-800 mb-2">
              ⚠️ Lưu ý quan trọng
            </h4>
            <div className="text-sm text-orange-700 space-y-1">
              <p>
                <strong>• Không tạo quá nhiều:</strong> 10-15 danh mục là đủ
              </p>
              <p>
                <strong>• Đặt tên rõ ràng:</strong> Dễ hiểu, dễ nhớ
              </p>
              <p>
                <strong>• Phân nhóm hợp lý:</strong> Giúp quản lý dễ dàng hơn
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
