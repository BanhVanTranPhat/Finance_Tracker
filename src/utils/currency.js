export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatNumber = (value) => {
  const number = value.replace(/[^\d]/g, "");
  if (!number) return "";
  return new Intl.NumberFormat("en-US").format(Number(number));
};

export const parseFormattedNumber = (value) => {
  return Number(value.replace(/[^\d]/g, ""));
};

export const getCurrencySymbol = () => "₫";

// No exchange/conversion when single currency is used
