import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console (in production, this should go to error tracking service)
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // TODO: In production, send error to error tracking service (e.g., Sentry)
    // if (process.env.NODE_ENV === "production") {
    //   errorTrackingService.logError(error, errorInfo);
    // }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    this.handleReset();
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      const isDevelopment = import.meta.env.DEV;

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
            {/* Error Icon */}
            <div className="flex items-center justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
              Đã xảy ra lỗi
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Ứng dụng đã gặp một lỗi không mong muốn. Vui lòng thử lại hoặc liên hệ hỗ trợ.
            </p>

            {/* Error Details (Development Only) */}
            {isDevelopment && error && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Chi tiết lỗi (Development Mode):
                </h3>
                <pre className="text-xs text-gray-600 overflow-auto max-h-40">
                  {error.toString()}
                  {errorInfo?.componentStack}
                </pre>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition"
              >
                <RefreshCw className="w-5 h-5" />
                Thử lại
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
              >
                <Home className="w-5 h-5" />
                Về trang chủ
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                Nếu vấn đề vẫn tiếp tục, vui lòng{" "}
                <a
                  href="mailto:support@financetracker.com"
                  className="text-emerald-600 hover:text-emerald-700 underline"
                >
                  liên hệ hỗ trợ
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

