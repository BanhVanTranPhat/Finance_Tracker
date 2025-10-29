import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function DatePicker({
  selectedDate,
  onDateChange,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const dropdownRef = useRef(null);

  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - 5 + i
  );

  const formatDisplayDate = (date) => {
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const handleDateSelect = (year, month) => {
    const newDate = new Date(year, month, 1);
    onDateChange(newDate);
    setIsOpen(false);
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePreviousYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected Date Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white text-emerald-700 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl flex items-center justify-center space-x-1.5 sm:space-x-2 transition-all shadow-md hover:shadow-lg border-2 border-yellow-400 hover:border-yellow-500 active:scale-95 font-medium"
      >
        <span className="font-bold text-sm sm:text-base whitespace-nowrap">
          {formatDisplayDate(selectedDate)}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 w-[calc(100vw-2rem)] max-w-sm sm:w-80">
          {/* Header with Year Navigation */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-blue-50">
            <button
              onClick={handlePreviousYear}
              className="p-1.5 sm:p-2 hover:bg-white/70 rounded-lg transition-all active:scale-95"
              aria-label="Previous Year"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <span className="font-bold text-lg sm:text-xl text-gray-800">
              {currentYear}
            </span>
            <button
              onClick={handleNextYear}
              className="p-1.5 sm:p-2 hover:bg-white/70 rounded-lg transition-all active:scale-95"
              aria-label="Next Year"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Month Grid */}
          <div className="p-3 sm:p-5">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {months.map((month, index) => {
                const isSelected =
                  selectedDate.getFullYear() === currentYear &&
                  selectedDate.getMonth() === index;
                const isCurrentMonth =
                  new Date().getFullYear() === currentYear &&
                  new Date().getMonth() === index;

                return (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(currentYear, index)}
                    className={`p-2.5 sm:p-3 text-xs sm:text-sm font-medium rounded-xl transition-all active:scale-95 ${
                      isSelected
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200"
                        : isCurrentMonth
                        ? "bg-blue-50 text-blue-700 active:bg-blue-100 border border-blue-200"
                        : "active:bg-gray-50 text-gray-700 border border-transparent active:border-gray-200"
                    }`}
                  >
                    {month}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-3 sm:px-5 pb-3 sm:pb-5 pt-2 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={() => {
                  const today = new Date();
                  handleDateSelect(today.getFullYear(), today.getMonth());
                }}
                className="py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-medium bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl active:from-emerald-600 active:to-emerald-700 transition-all shadow-sm active:scale-95"
              >
                Tháng này
              </button>
              <button
                onClick={() => {
                  const lastMonth = new Date();
                  lastMonth.setMonth(lastMonth.getMonth() - 1);
                  handleDateSelect(
                    lastMonth.getFullYear(),
                    lastMonth.getMonth()
                  );
                }}
                className="py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-medium bg-gray-100 text-gray-700 rounded-xl active:bg-gray-200 transition-all shadow-sm active:scale-95"
              >
                Tháng trước
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
