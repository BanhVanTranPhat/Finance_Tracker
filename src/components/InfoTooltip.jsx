import { useState } from "react";
import { Info } from "lucide-react";

export default function InfoTooltip({
  content,
  title,
  position = "top",
  className = "",
}) {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
      case "bottom":
        return "top-full left-1/2 transform -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 transform -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 transform -translate-y-1/2 ml-2";
      default:
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case "top":
        return "top-full left-1/2 transform -translate-x-1/2 border-t-gray-800";
      case "bottom":
        return "bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800";
      case "left":
        return "left-full top-1/2 transform -translate-y-1/2 border-l-gray-800";
      case "right":
        return "right-full top-1/2 transform -translate-y-1/2 border-r-gray-800";
      default:
        return "top-full left-1/2 transform -translate-x-1/2 border-t-gray-800";
    }
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* Info Icon */}
      <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center cursor-help hover:bg-gray-400 transition-colors">
        <Info className="w-3 h-3 text-gray-600" />
      </div>

      {/* Tooltip */}
      {isVisible && (
        <div className={`absolute z-50 ${getPositionClasses()}`}>
          <div className="bg-gray-900 text-white text-xs rounded-md px-2 py-1.5 shadow-xl max-w-48">
            {title && (
              <div className="font-medium mb-0.5 text-white text-xs">
                {title}
              </div>
            )}
            <div className="text-gray-200 leading-tight">{content}</div>

            {/* Arrow */}
            <div
              className={`absolute w-0 h-0 border-2 border-transparent ${getArrowClasses()}`}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
