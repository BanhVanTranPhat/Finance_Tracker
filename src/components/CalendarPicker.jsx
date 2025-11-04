import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function CalendarPicker({
  selectedDate,
  onDateChange,
  onClose,
  className = "",
}) {
  const { t, language } = useLanguage();
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const calendarRef = useRef(null);

  // Get localized month names
  const monthNames = language === "vi"
    ? [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
      ]
    : [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ];

  const dayNames = language === "vi"
    ? ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
    : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
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

  // Handle continuous scrolling
  useEffect(() => {
    const handleWheel = (e) => {
      if (calendarRef.current && calendarRef.current.contains(e.target)) {
        e.preventDefault();
        if (e.deltaY > 0) {
          // Scrolling down - go to next month
          setCurrentMonth((prevMonth) => {
            if (prevMonth === 11) {
              setCurrentYear((prevYear) => prevYear + 1);
              return 0;
            }
            return prevMonth + 1;
          });
        } else {
          // Scrolling up - go to previous month
          setCurrentMonth((prevMonth) => {
            if (prevMonth === 0) {
              setCurrentYear((prevYear) => prevYear - 1);
              return 11;
            }
            return prevMonth - 1;
          });
        }
      }
    };

    const calendarElement = calendarRef.current;
    if (calendarElement) {
      calendarElement.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        calendarElement.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);

  const handleDateSelect = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);
    onDateChange(newDate);
    if (onClose) onClose();
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    handleDateSelect(today.getDate());
  };

  const handleClear = () => {
    const today = new Date();
    onDateChange(today);
    if (onClose) onClose();
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();
  const isToday = (day) => {
    return (
      day !== null &&
      currentYear === today.getFullYear() &&
      currentMonth === today.getMonth() &&
      day === today.getDate()
    );
  };

  const isSelected = (day) => {
    return (
      day !== null &&
      currentYear === selectedDate.getFullYear() &&
      currentMonth === selectedDate.getMonth() &&
      day === selectedDate.getDate()
    );
  };

  return (
    <div
      ref={calendarRef}
      className={`bg-white rounded-2xl shadow-xl border border-gray-200 z-50 ${className}`}
      style={{ width: "320px", maxWidth: "calc(100vw - 2rem)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-blue-50">
        <button
          onClick={handlePreviousMonth}
          onMouseDown={(e) => {
            // Support continuous clicking
            let interval;
            const startContinuous = () => {
              interval = setInterval(() => {
                handlePreviousMonth();
              }, 150); // Fast continuous navigation
            };
            const stopContinuous = () => {
              if (interval) clearInterval(interval);
              handlePreviousMonth(); // Execute once on click
            };

            startContinuous();
            const handleMouseUp = () => {
              stopContinuous();
              document.removeEventListener("mouseup", handleMouseUp);
              document.removeEventListener("mouseleave", handleMouseUp);
            };
            document.addEventListener("mouseup", handleMouseUp);
            document.addEventListener("mouseleave", handleMouseUp);
          }}
          className="p-2 hover:bg-white/70 rounded-lg transition-all active:scale-95"
          aria-label="Previous Month"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        <div className="flex items-center space-x-2">
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
            className="text-base font-bold text-gray-800 bg-transparent border-none outline-none cursor-pointer"
          >
            {monthNames.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(parseInt(e.target.value))}
            className="text-base font-bold text-gray-800 bg-transparent border-none outline-none cursor-pointer"
          >
            {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 10 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleNextMonth}
          onMouseDown={(e) => {
            // Support continuous clicking
            let interval;
            const startContinuous = () => {
              interval = setInterval(() => {
                handleNextMonth();
              }, 150); // Fast continuous navigation
            };
            const stopContinuous = () => {
              if (interval) clearInterval(interval);
              handleNextMonth(); // Execute once on click
            };

            startContinuous();
            const handleMouseUp = () => {
              stopContinuous();
              document.removeEventListener("mouseup", handleMouseUp);
              document.removeEventListener("mouseleave", handleMouseUp);
            };
            document.addEventListener("mouseup", handleMouseUp);
            document.addEventListener("mouseleave", handleMouseUp);
          }}
          className="p-2 hover:bg-white/70 rounded-lg transition-all active:scale-95"
          aria-label="Next Month"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day names header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day, index) => (
            <div
              key={index}
              className="text-center text-xs font-semibold text-gray-500 py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={index} className="aspect-square" />;
            }

            const isDayToday = isToday(day);
            const isDaySelected = isSelected(day);

            return (
              <button
                key={index}
                onClick={() => handleDateSelect(day)}
                className={`aspect-square rounded-lg text-sm font-medium transition-all active:scale-95 ${
                  isDaySelected
                    ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg"
                    : isDayToday
                    ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer actions */}
      <div className="px-4 pb-4 pt-2 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleToday}
            className="py-2 px-4 text-sm font-medium bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl active:from-emerald-600 active:to-emerald-700 transition-all shadow-sm active:scale-95"
          >
            {t("today") || "Hôm nay"}
          </button>
          <button
            onClick={handleClear}
            className="py-2 px-4 text-sm font-medium bg-gray-100 text-gray-700 rounded-xl active:bg-gray-200 transition-all shadow-sm active:scale-95"
          >
            {t("clear") || "Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
}

