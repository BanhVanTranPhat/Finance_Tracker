import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Get the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");

        if (error) {
          console.error("Google OAuth error:", error);
          alert("Đăng nhập Google thất bại: " + error);
          navigate("/login");
          return;
        }

        if (!code) {
          console.error("No authorization code received");
          alert("Không nhận được mã xác thực từ Google");
          navigate("/login");
          return;
        }

        // Exchange code for token
        const response = await fetch("http://localhost:5000/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Google authentication failed");
        }

        const data = await response.json();

        // Save token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem(
          "onboarding_completed",
          data.user.onboardingCompleted ? "true" : "false"
        );

        // Set Google OAuth flag for desktop layout preference
        localStorage.setItem("google_oauth_login", "true");

        // Update AuthContext state immediately
        setUser(data.user);

        // Dispatch Google OAuth success event for consistency
        window.dispatchEvent(new CustomEvent("googleAuthSuccess", {
          detail: { user: data.user, token: data.token }
        }));

        // Redirect to dashboard
        navigate("/dashboard");
      } catch (error) {
        console.error("Google callback error:", error);
        alert("Lỗi xử lý đăng nhập Google: " + error.message);
        navigate("/login");
      }
    };

    handleGoogleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Đang xử lý đăng nhập Google...
        </h2>
        <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
      </div>
    </div>
  );
}
