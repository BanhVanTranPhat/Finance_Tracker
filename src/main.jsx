import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Expose Google callback globally for Google Identity Services button
window.handleGoogleCredential = async (response) => {
  console.log("🎉 Google callback được gọi!", response);

  try {
    const base = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    console.log("📡 Gửi credential đến backend:", base + "/auth/google");

    const res = await fetch(base + "/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: response.credential }),
    });

    console.log("📥 Backend response status:", res.status);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("❌ Backend error:", errorData);
      throw new Error(
        errorData.message || `HTTP ${res.status}: Google sign-in failed`
      );
    }

    const data = await res.json();
    console.log("✅ Backend success:", data);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Set onboarding status
    if (!localStorage.getItem("onboarding_completed")) {
      localStorage.setItem("onboarding_completed", "false");
    }

    // Trigger storage event to update AuthContext immediately
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "token",
        newValue: data.token,
        oldValue: null,
        url: window.location.href,
      })
    );

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "user",
        newValue: JSON.stringify(data.user),
        oldValue: null,
        url: window.location.href,
      })
    );

    console.log("🚀 Redirecting to dashboard...");
    // Small delay to ensure AuthContext is updated
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 100);
  } catch (e) {
    console.error("❌ Google OAuth Error:", e);
    const errorMessage =
      e instanceof Error
        ? e.message
        : "Không đăng nhập Google được. Vui lòng thử lại.";
    alert(errorMessage);
  }
};
