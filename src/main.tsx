import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Expose Google callback globally for Google Identity Services button
(window as any).handleGoogleCredential = async (response: {
  credential: string;
}) => {
  try {
    const base = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const res = await fetch(base + "/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: response.credential }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${res.status}: Google sign-in failed`
      );
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    // Force show onboarding for tài khoản mới nếu chưa từng hoàn tất
    if (!localStorage.getItem("onboarding_completed")) {
      localStorage.setItem("onboarding_completed", "false");
    }
    location.reload();
  } catch (e) {
    console.error("Google OAuth Error:", e);
    const errorMessage =
      e instanceof Error
        ? e.message
        : "Không đăng nhập Google được. Vui lòng thử lại.";
    alert(errorMessage);
  }
};
