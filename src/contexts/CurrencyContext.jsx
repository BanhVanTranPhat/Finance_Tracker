import { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

export const currencies = {
  VND: {
    code: "VND",
    symbol: "₫",
    name: "Vietnamese Dong (₫)",
    rate: 1, // Base currency
    format: (amount) => `${amount.toLocaleString("vi-VN")}₫`,
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar ($)",
    rate: 0.00004, // 1 VND ≈ 0.00004 USD (approximate)
    format: (amount) =>
      `$${amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
  },
};

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem("selected_currency");
    return saved || "VND";
  });

  useEffect(() => {
    localStorage.setItem("selected_currency", currency);
  }, [currency]);

  const convertAmount = (amount, fromCurrency = "VND") => {
    if (fromCurrency === currency) return amount;

    // Convert to VND first (base currency)
    const amountInVND =
      fromCurrency === "VND" ? amount : amount / currencies[fromCurrency].rate;

    // Then convert to target currency
    return currency === "VND"
      ? amountInVND
      : amountInVND * currencies[currency].rate;
  };

  const formatCurrency = (amount, fromCurrency = "VND") => {
    const convertedAmount = convertAmount(amount, fromCurrency);
    return currencies[currency].format(convertedAmount);
  };

  const value = {
    currency,
    setCurrency,
    currencies,
    convertAmount,
    formatCurrency,
    currencySymbol: currencies[currency].symbol,
    currencyName: currencies[currency].name,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
