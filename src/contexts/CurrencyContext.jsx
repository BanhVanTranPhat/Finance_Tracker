import { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

// Default exchange rate: 1 USD = 25,000 VND
const DEFAULT_USD_TO_VND_RATE = 25000;

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
    // rate will be calculated dynamically from usdToVndRate
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

  // Load custom USD to VND rate from localStorage
  const [usdToVndRate, setUsdToVndRate] = useState(() => {
    const saved = localStorage.getItem("usd_to_vnd_rate");
    return saved ? parseFloat(saved) : DEFAULT_USD_TO_VND_RATE;
  });

  // Update USD rate when usdToVndRate changes
  useEffect(() => {
    if (usdToVndRate > 0) {
      currencies.USD.rate = 1 / usdToVndRate; // 1 VND = 1/USD_RATE USD
      localStorage.setItem("usd_to_vnd_rate", usdToVndRate.toString());
    }
  }, [usdToVndRate]);

  useEffect(() => {
    localStorage.setItem("selected_currency", currency);
  }, [currency]);

  // Auto-switch language when currency changes
  useEffect(() => {
    const storedLanguage = localStorage.getItem("app_language") || "vi";
    const hasManuallySetLanguage = localStorage.getItem("language_manually_set") === "true";
    
    // Auto-switch to English when USD is selected, but only if user hasn't manually set language
    if (currency === "USD" && storedLanguage === "vi" && !hasManuallySetLanguage) {
      localStorage.setItem("app_language", "en");
      // Trigger a custom event that LanguageContext can listen to
      window.dispatchEvent(
        new CustomEvent("languagechange", {
          detail: { language: "en" }
        })
      );
      // Also trigger storage event for cross-tab sync
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "app_language",
          newValue: "en",
          oldValue: "vi",
        })
      );
    } else if (currency === "VND" && storedLanguage === "en" && !hasManuallySetLanguage) {
      localStorage.setItem("app_language", "vi");
      window.dispatchEvent(
        new CustomEvent("languagechange", {
          detail: { language: "vi" }
        })
      );
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "app_language",
          newValue: "vi",
          oldValue: "en",
        })
      );
    }
  }, [currency]);

  const convertAmount = (amount, fromCurrency = "VND") => {
    if (fromCurrency === currency) return amount;

    // Convert to VND first (base currency)
    let amountInVND;
    if (fromCurrency === "VND") {
      amountInVND = amount;
    } else if (fromCurrency === "USD") {
      // Convert USD to VND using custom rate
      amountInVND = amount * usdToVndRate;
    } else {
      amountInVND = amount / currencies[fromCurrency].rate;
    }

    // Then convert to target currency
    if (currency === "VND") {
      return amountInVND;
    } else if (currency === "USD") {
      // Convert VND to USD using custom rate
      return amountInVND / usdToVndRate;
    } else {
      return amountInVND * currencies[currency].rate;
    }
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
    usdToVndRate,
    setUsdToVndRate,
    DEFAULT_USD_TO_VND_RATE,
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
