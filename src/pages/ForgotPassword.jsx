import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ArrowLeft, Mail } from "lucide-react";

const ForgotSchema = Yup.object().shape({
  email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
});

export default function ForgotPassword({ onBack, onGoToReset }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
        {onBack && (
          <div className="absolute top-4 left-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-gray-700"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Quay lại</span>
            </button>
          </div>
        )}

        <div className="flex items-center justify-center mb-8">
          <div className="bg-emerald-500 p-3 rounded-full">
            <Mail className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Quên mật khẩu</h1>
        <p className="text-center text-gray-600 mb-6">Nhập email để nhận mã xác thực (6 số)</p>

        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <Formik
          initialValues={{ email: "" }}
          validationSchema={ForgotSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setMessage("");
            setError("");
            try {
              const base = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
              const res = await fetch(base + "/auth/forgot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: values.email }),
              });
              const data = await res.json().catch(() => ({}));
              if (!res.ok) throw new Error(data.message || "Gửi mã thất bại");
              setMessage("Nếu email tồn tại, mã xác thực đã được gửi. Vui lòng kiểm tra hộp thư.");
              if (onGoToReset) onGoToReset(values.email);
            } catch (e) {
              setError(e instanceof Error ? e.message : "Có lỗi xảy ra");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  placeholder="you@example.com"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi mã xác thực"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}


