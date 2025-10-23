import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../contexts/AuthContext.jsx";
import { LogIn, Wallet } from "lucide-react";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  password: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Vui lòng nhập mật khẩu"),
});

export default function Login({ onSwitchToRegister }) {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const clientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    "885076368157-gk6624okffn4thbbh366uhb18ul2ne7t.apps.googleusercontent.com"; // Updated Client ID

  useEffect(() => {
    if (!clientId || clientId === "your-google-client-id") {
      console.error("VITE_GOOGLE_CLIENT_ID is not configured");
      setError(
        "Google OAuth chưa được cấu hình. Vui lòng liên hệ quản trị viên."
      );
      return;
    }
    // Removed duplicate callback definition here
    const g = window.google?.accounts?.id;
    const container = document.querySelector(".g_id_signin");

    if (g && container) {
      try {
        console.log("Initializing Google Sign-In with client ID:", clientId);
        g.initialize({
          client_id: clientId,
          callback: window.handleGoogleCredential, // Uses global callback
        });
        g.renderButton(container, {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          text: "signin_with",
          width: "400",
        });
        console.log("Google Sign-In button rendered successfully");
      } catch (e) {
        console.error("Google Sign-In initialization error:", e);
        setError("Không thể khởi tạo Google Sign-In. Vui lòng tải lại trang.");
      }
    } else if (!g) {
      console.error("Google Identity Services not loaded");
      setError(
        "Google Identity Services chưa được tải. Vui lòng kiểm tra kết nối mạng."
      );
    }
  }, [clientId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-emerald-500 p-3 rounded-full">
            <Wallet className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Đăng nhập
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Quản lý tài chính cá nhân của bạn
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setError("");
              await login(values.email, values.password);
            } catch (err) {
              const errorMessage =
                err instanceof Error ? err.message : "Đăng nhập thất bại";
              setError(errorMessage);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  placeholder="your@email.com"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mật khẩu
                </label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  placeholder="••••••••"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogIn className="w-5 h-5" />
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-6">
          <div
            id="g_id_onload"
            data-client_id={clientId}
            data-context="signin"
            data-ux_mode="redirect"
            data-redirect_uri={`${window.location.origin}/auth/callback`}
            data-auto_prompt="false"
            className="hidden"
          />
          <div
            className="g_id_signin"
            data-client_id={clientId}
            data-type="standard"
            data-size="large"
            data-shape="rectangular"
            data-theme="outline"
            data-text="signin_with"
            data-logo_alignment="left"
            data-width="100%"
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Chưa có tài khoản?{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-emerald-500 hover:text-emerald-600 font-semibold transition"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
