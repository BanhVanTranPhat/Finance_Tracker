import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { LogIn, Wallet, Languages, ArrowLeft } from "lucide-react";

const getLoginSchema = (t) => Yup.object().shape({
  email: Yup.string()
    .email(t("invalidEmail"))
    .required(t("emailRequired")),
  password: Yup.string()
    .min(6, t("passwordMinLength"))
    .required(t("passwordRequired")),
});

export default function Login({ onSwitchToRegister, onBackToLanding, onForgotPassword }) {
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [error, setError] = useState("");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  
  const LoginSchema = getLoginSchema(t);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || clientId === "your-google-client-id") {
      console.error("VITE_GOOGLE_CLIENT_ID is not configured");
      setError(t("googleOAuthNotConfigured"));
      return;
    }

    // Set locale based on current language
    const locale = language === "vi" ? "vi" : "en";
    
    // Update HTML lang attribute
    document.documentElement.lang = locale;

    // Wait for Google Identity Services to load
    const initializeGoogle = () => {
      const g = window.google?.accounts?.id;
      const container = document.querySelector(".g_id_signin");

      if (g && container) {
        try {
          // Clear container completely before re-rendering
          container.innerHTML = "";
          
          console.log("Initializing Google Sign-In with client ID:", clientId, "locale:", locale);
          
          // Re-initialize with current locale context
          g.initialize({
            client_id: clientId,
            callback: window.handleGoogleCredential,
          });

          // Wait a bit for container to have proper dimensions and ensure HTML lang is set
          setTimeout(() => {
            // Get container width for responsive button
            const containerWidth = Math.max(container.offsetWidth, 300);

            // Render button - Google will use document.documentElement.lang for locale
            g.renderButton(container, {
              theme: "outline",
              size: "large",
              shape: "rectangular",
              text: "signin_with",
              width: containerWidth,
              logo_alignment: "left",
            });
            console.log(
              "Google Sign-In button rendered successfully with width:",
              containerWidth,
              "locale:",
              locale,
              "HTML lang:",
              document.documentElement.lang
            );
          }, 100); // Increased delay to ensure HTML lang is processed
        } catch (e) {
          console.error("Google Sign-In initialization error:", e);
          setError(t("googleSignInInitError"));
        }
      } else if (!g) {
        console.error("Google Identity Services not loaded yet");
        // Retry after a short delay
        setTimeout(initializeGoogle, 100);
      }
    };

    // Load/reload Google script with correct locale
    const loadGoogleScript = () => {
      // Remove all existing Google Identity Services scripts
      const existingScripts = document.querySelectorAll('script[src*="accounts.google.com/gsi/client"]');
      existingScripts.forEach(script => script.remove());
      
      // Clear window.google to force reload
      if (window.google?.accounts) {
        delete window.google.accounts;
      }
      
      // Create new script with locale parameter
      const script = document.createElement("script");
      script.id = "google-identity-script";
      script.src = `https://accounts.google.com/gsi/client?hl=${locale}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google Identity Services loaded with locale:", locale);
        // Wait a bit for Google API to be ready
        setTimeout(initializeGoogle, 200);
      };
      script.onerror = () => {
        console.error("Failed to load Google Identity Services");
        setError(t("googleSignInInitError"));
      };
      
      document.body.appendChild(script);
    };

    // Load script with correct locale
    loadGoogleScript();

    // Cleanup function
    return () => {
      const script = document.getElementById("google-identity-script");
      if (script) {
        script.remove();
    }
    };
  }, [clientId, language, t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
        {/* Back Button */}
        {onBackToLanding && (
          <div className="absolute top-4 left-4">
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-gray-700"
              aria-label={t("goBack") || "Back to home"}
              title={t("goBack") || "Back to home"}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">{t("goBack") || "Back"}</span>
            </button>
          </div>
        )}
        {/* Language Selector */}
        <div className="absolute top-4 right-4">
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-gray-700"
              aria-label="Select language"
            >
              <Languages className="w-5 h-5" />
              <span className="text-sm font-medium">{language === "vi" ? "VI" : "EN"}</span>
            </button>
            {showLanguageMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLanguageMenu(false)}
                ></div>
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 min-w-[150px]">
                  <button
                    onClick={() => {
                      setLanguage("vi");
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
                      language === "vi" ? "bg-emerald-50 text-emerald-600 font-semibold" : "text-gray-700"
                    }`}
                  >
                    Tiếng Việt
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("en");
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
                      language === "en" ? "bg-emerald-50 text-emerald-600 font-semibold" : "text-gray-700"
                    }`}
                  >
                    English
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-center mb-8">
          <div className="bg-emerald-500 p-3 rounded-full">
            <Wallet className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {t("login")}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {t("loginSubtitle")}
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
                err instanceof Error ? err.message : t("loginFailed");
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
                  {t("email")}
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
                  {t("password")}
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
                {isSubmitting ? t("loggingIn") : t("login")}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-4 text-center">
          <button
            onClick={onForgotPassword}
            className="text-emerald-500 hover:text-emerald-600 font-semibold transition"
          >
            Quên mật khẩu?
          </button>
        </div>

        <div className="mt-6">
          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">{t("or")}</span>
            </div>
          </div>

          {/* Custom styled Google Sign-In button container */}
          <div className="w-full google-btn-wrapper overflow-hidden">
            <div className="g_id_signin" style={{ minHeight: "44px" }}></div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {t("noAccountYet")}{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-emerald-500 hover:text-emerald-600 font-semibold transition"
            >
              {t("registerNow")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
