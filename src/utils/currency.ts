export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatNumber = (value: string): string => {
  const number = value.replace(/[^\d]/g, "");
  if (!number) return "";
  return new Intl.NumberFormat("en-US").format(Number(number));
};

export const parseFormattedNumber = (value: string): number => {
  return Number(value.replace(/[^\d]/g, ""));
};

export const getCurrencySymbol = (): string => "₫";

// No exchange/conversion when single currency is used
