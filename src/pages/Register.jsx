import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { UserPlus, Wallet, Languages, ArrowLeft } from "lucide-react";

const getRegisterSchema = (t) => Yup.object().shape({
  name: Yup.string()
    .min(2, t("nameMinLength"))
    .required(t("nameRequired")),
  email: Yup.string()
    .email(t("invalidEmail"))
    .required(t("emailRequired")),
  password: Yup.string()
    .min(6, t("passwordMinLength"))
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t("passwordStrengthRequirement"))
    .required(t("passwordRequired")),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], t("passwordsDontMatch"))
    .required(t("confirmPasswordRequired")),
});

export default function Register({ onSwitchToLogin, onBackToLanding }) {
  const { register } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [error, setError] = useState("");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  
  const RegisterSchema = getRegisterSchema(t);

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
          {t("register")}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {t("registerSubtitle")}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setError("");
              await register(values.email, values.password, values.name);
            } catch (err) {
              const errorMessage =
                err instanceof Error ? err.message : t("registerFailed");
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
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("fullName")}
                </label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  placeholder={t("placeholderName")}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

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

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("confirmPassword")}
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  placeholder="••••••••"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus className="w-5 h-5" />
                {isSubmitting ? t("registering") : t("register")}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {t("alreadyHaveAccount")}{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-emerald-500 hover:text-emerald-600 font-semibold transition"
            >
              {t("loginNow")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
