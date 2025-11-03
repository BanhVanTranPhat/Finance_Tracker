// Mapping từ category names tiếng Việt sang tiếng Anh
// Sử dụng cho các category names đã có trong database
const viToEnMap = {
  // Income Categories
  "Lương": "Salary",
  "Thưởng": "Bonus",
  "Đầu tư": "Investment",
  "Thu nhập khác": "Other Income",
  
  // Expense Categories - Mandatory
  "Tiền nhà": "Rent/Housing",
  "Hoá đơn": "Bills",
  "Ăn uống": "Food & Drink",
  "Đi lại": "Transportation",
  "Con cái": "Children",
  "Thú cưng": "Pets",
  "Trả nợ/khoản vay": "Debt/Loans",
  "Trả nợ": "Debt/Loans",
  
  // Irregular Expenses
  "Khám bệnh/thuốc men": "Medical/Medication",
  "Bảo hiểm nhân thọ": "Life Insurance",
  "Bảo hiểm": "Insurance",
  "Bảo trì xe": "Car Maintenance",
  "Quà tặng, hiếu hỉ": "Gifts, Celebrations",
  "Quà tặng": "Gifts",
  "Học phí, khoá học online": "Tuition, Online Courses",
  "Học phí": "Tuition",
  
  // My Joys
  "Trang hoàng nhà cửa": "Home Decoration",
  "Du lịch ngắn ngày": "Short Trips",
  "Du lịch": "Travel",
  
  // Long-term Investment
  "Mua nhà": "Buy House",
  "Mua xe": "Buy Car",
  "Sửa nhà": "Home Repair",
  "Nâng cấp thiết bị, đồ nghề": "Equipment Upgrade, Tools",
  "Nâng cấp thiết bị": "Equipment Upgrade",
  
  // 50/30/20 Template
  "Nhà ở": "Housing",
  "Ăn uống hằng ngày": "Daily Food",
  "Bảo hiểm bắt buộc": "Mandatory Insurance",
  "Thuốc men cơ bản": "Basic Medicine",
  "Ăn ngoài/cafe": "Dining Out/Cafe",
  "Shopping/giải trí": "Shopping/Entertainment",
  "Spa, massage": "Spa, Massage",
  "Sở thích cá nhân": "Personal Hobbies",
  "Quỹ khẩn cấp": "Emergency Fund",
  "Đầu tư dài hạn": "Long-term Investment",
  "Học tập / phát triển bản thân": "Education / Self Development",
};

// Create reverse mapping (English to Vietnamese)
const enToViMap = {};
Object.keys(viToEnMap).forEach((viKey) => {
  const enValue = viToEnMap[viKey];
  enToViMap[enValue] = viKey;
});

/**
 * Translate category name based on current language
 * @param {string} categoryName - The category name to translate
 * @param {string} currentLanguage - Current language ('vi' or 'en')
 * @returns {string} - Translated category name, or original if no translation found
 */
export const translateCategoryName = (categoryName, currentLanguage) => {
  if (!categoryName) return categoryName;
  
  const trimmedName = categoryName.trim();
  
  // If language is English and name is Vietnamese, translate to English
  if (currentLanguage === "en" && viToEnMap[trimmedName]) {
    return viToEnMap[trimmedName];
  }
  
  // If language is Vietnamese and name is English, translate to Vietnamese
  if (currentLanguage === "vi" && enToViMap[trimmedName]) {
    return enToViMap[trimmedName];
  }
  
  // No translation found or already in correct language, return original
  return trimmedName;
};

// Export mappings for use in components if needed
export { viToEnMap, enToViMap };

