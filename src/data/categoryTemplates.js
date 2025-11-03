// Danh mục thu nhập mặc định (tự động tạo)
export const defaultIncomeCategories = [
  { id: "salary", name: "Lương", type: "income", icon: "dollar-sign" },
  { id: "bonus", name: "Thưởng", type: "income", icon: "gift" },
  { id: "investment", name: "Đầu tư", type: "income", icon: "line-chart" },
  { id: "other-income", name: "Thu nhập khác", type: "income", icon: "coins" },
];

export const categoryTemplates = [
  {
    id: "finance-tracker-style",
    name: "Mẫu 1: Finance Tracker Style",
    description: "Phong cách quản lý tài chính linh hoạt và hiện đại",
    groups: [
      {
        id: "mandatory",
        name: "Chi phí bắt buộc",
        categories: [
          { id: "rent", name: "Tiền nhà", icon: "home", selected: true },
          { id: "bills", name: "Hoá đơn", icon: "receipt", selected: true },
          { id: "food", name: "Ăn uống", icon: "utensils", selected: true },
          { id: "transportation", name: "Đi lại", icon: "bus", selected: true },
          { id: "children", name: "Con cái", icon: "baby", selected: true },
          { id: "pets", name: "Thú cưng", icon: "paw-print", selected: true },
          { id: "debt", name: "Trả nợ/khoản vay", icon: "credit-card", selected: true },
        ],
      },
      {
        id: "irregular",
        name: "Chi phí không thường xuyên",
        categories: [
          { id: "healthcare", name: "Khám bệnh/thuốc men", icon: "pill", selected: true },
          { id: "insurance", name: "Bảo hiểm nhân thọ", icon: "shield-check", selected: true },
          { id: "car-maintenance", name: "Bảo trì xe", icon: "car", selected: true },
          { id: "gifts", name: "Quà tặng, hiếu hỉ", icon: "gift", selected: true },
          { id: "education", name: "Học phí, khoá học online", icon: "graduation-cap", selected: true },
        ],
      },
      {
        id: "joy",
        name: "Niềm vui của tôi",
        categories: [
          { id: "shopping", name: "Shopping", icon: "shopping-bag", selected: true },
          { id: "massage", name: "Massage", icon: "sparkles", selected: true },
          { id: "spa", name: "Spa", icon: "sparkles", selected: true },
          {
            id: "home-decoration",
            name: "Trang hoàng nhà cửa",
            icon: "sofa",
            selected: true,
          },
          { id: "short-trips", name: "Du lịch ngắn ngày", icon: "plane", selected: true },
        ],
      },
      {
        id: "long-term-investment",
        name: "Đầu tư dài hạn",
        categories: [
          { id: "buy-house", name: "Mua nhà", icon: "house", selected: true },
          { id: "buy-car", name: "Mua xe", icon: "car", selected: true },
          { id: "home-repair", name: "Sửa nhà", icon: "wrench", selected: true },
          {
            id: "equipment-upgrade",
            name: "Nâng cấp thiết bị, đồ nghề",
            icon: "toolbox",
            selected: true,
          },
        ],
      },
    ],
  },
  {
    id: "50-30-20",
    name: "Mẫu 2: 50/30/20",
    description:
      "Phương pháp phân bổ ngân sách 50% nhu cầu, 30% mong muốn, 20% tiết kiệm",
    groups: [
      {
        id: "needs",
        name: "Nhu cầu thiết yếu (50%)",
        percentage: 50,
        categories: [
          { id: "housing", name: "Nhà ở", selected: true },
          { id: "daily-food", name: "Ăn uống hằng ngày", selected: true },
          { id: "transportation", name: "Đi lại", selected: true },
          {
            id: "mandatory-insurance",
            name: "Bảo hiểm bắt buộc",
            selected: true,
          },
          { id: "basic-medicine", name: "Thuốc men cơ bản", selected: true },
        ],
      },
      {
        id: "wants",
        name: "Mong muốn (30%)",
        percentage: 30,
        categories: [
          { id: "dining-out", name: "Ăn ngoài/cafe", selected: true },
          {
            id: "shopping-entertainment",
            name: "Shopping/giải trí",
            selected: true,
          },
          { id: "travel", name: "Du lịch", selected: true },
          { id: "spa-massage", name: "Spa, massage", selected: true },
          { id: "personal-hobbies", name: "Sở thích cá nhân", selected: true },
        ],
      },
      {
        id: "savings-investment",
        name: "Tiết kiệm & Đầu tư (20%)",
        percentage: 20,
        categories: [
          { id: "emergency-fund", name: "Quỹ khẩn cấp", selected: true },
          { id: "buy-house", name: "Mua nhà", selected: true },
          { id: "buy-car", name: "Mua xe", selected: true },
          {
            id: "long-term-investment",
            name: "Đầu tư dài hạn",
            selected: true,
          },
          {
            id: "equipment-upgrade",
            name: "Nâng cấp thiết bị",
            selected: true,
          },
          {
            id: "self-development",
            name: "Học tập / phát triển bản thân",
            selected: true,
          },
        ],
      },
    ],
  },
];
