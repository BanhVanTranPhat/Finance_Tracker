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
        className="bg-white text-gray-800 px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-gray-50 transition-colors shadow-sm"
      >
        <span className="font-medium">{formatDisplayDate(selectedDate)}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 min-w-64">
          {/* Header with Year Navigation */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <button
              onClick={handlePreviousYear}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-lg text-gray-800">
              {currentYear}
            </span>
            <button
              onClick={handleNextYear}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Month Grid */}
          <div className="p-4">
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => (
                <button
                  key={index}
                  onClick={() => handleDateSelect(currentYear, index)}
                  className={`p-3 text-sm rounded-lg transition-colors ${
                    selectedDate.getFullYear() === currentYear &&
                    selectedDate.getMonth() === index
                      ? "bg-emerald-500 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const today = new Date();
                  handleDateSelect(today.getFullYear(), today.getMonth());
                }}
                className="flex-1 py-2 px-3 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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
                className="flex-1 py-2 px-3 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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
