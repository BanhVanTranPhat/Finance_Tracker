/**
 * Centralized configuration module
 * Validates environment variables on startup
 */

const requiredEnvVars = {
  MONGO_URI: {
    name: "MongoDB connection string",
    validate: (value) => {
      if (!value) return false;
      if (!value.startsWith("mongodb://") && !value.startsWith("mongodb+srv://")) {
        console.warn("⚠️  MONGO_URI should start with 'mongodb://' or 'mongodb+srv://'");
      }
      return true;
    },
  },
  JWT_SECRET: {
    name: "JWT signing secret",
    validate: (value) => {
      if (!value) return false;
      if (value.length < 32) {
        console.error("❌ JWT_SECRET must be at least 32 characters long for security");
        return false;
      }
      return true;
    },
  },
  GOOGLE_CLIENT_ID: {
    name: "Google OAuth Client ID",
    validate: (value) => {
      if (!value) return false;
      if (value.includes("your-google-client-id") || value.includes("your-client-id")) {
        console.error("❌ GOOGLE_CLIENT_ID appears to be a placeholder. Please set a real Client ID.");
        return false;
      }
      return true;
    },
  },
  GOOGLE_CLIENT_SECRET: {
    name: "Google OAuth Client Secret",
    validate: (value) => {
      if (!value) return false;
      if (value.includes("your-client-secret") || value.includes("GOCSPX-your-client-secret-here")) {
        console.error("❌ GOOGLE_CLIENT_SECRET appears to be a placeholder. Please set a real Client Secret.");
        return false;
      }
      return true;
    },
  },
  // Optional: SMTP for sending emails (dev fallback if missing)
  SMTP_HOST: { name: "SMTP host", validate: () => true },
  SMTP_PORT: { name: "SMTP port", validate: () => true },
  SMTP_SECURE: { name: "SMTP secure flag", validate: () => true },
  SMTP_USER: { name: "SMTP user", validate: () => true },
  SMTP_PASS: { name: "SMTP password", validate: () => true },
  MAIL_FROM: { name: "Mail From", validate: () => true },
};

/**
 * Validates all required environment variables
 * Throws error if any are missing or invalid
 */
function validateEnv() {
  const missing = [];
  const invalid = [];

  for (const [key, config] of Object.entries(requiredEnvVars)) {
    const value = process.env[key];

    if (!value) {
      missing.push({ key, description: config.name });
      continue;
    }

    if (config.validate && !config.validate(value)) {
      invalid.push({ key, description: config.name });
    }
  }

  if (missing.length > 0) {
    console.error("\n❌ Missing required environment variables:");
    missing.forEach(({ key, description }) => {
      console.error(`  - ${key}: ${description}`);
    });
    console.error("\n💡 Please create a .env file in the server/ directory with these variables.");
    throw new Error(`Missing required environment variables: ${missing.map(({ key }) => key).join(", ")}`);
  }

  if (invalid.length > 0) {
    console.error("\n❌ Invalid environment variables:");
    invalid.forEach(({ key, description }) => {
      console.error(`  - ${key}: ${description}`);
    });
    throw new Error(`Invalid environment variables: ${invalid.map(({ key }) => key).join(", ")}`);
  }

  console.log("✅ All environment variables validated successfully");
}

// Validate on module load (only in production or when explicitly enabled)
if (process.env.NODE_ENV !== "test") {
  try {
    validateEnv();
  } catch (error) {
    // Only throw in production - in development, we might want to allow missing vars
    if (process.env.NODE_ENV === "production") {
      throw error;
    } else {
      console.warn("⚠️  Environment validation failed in development mode. Server will start but features may not work.");
    }
  }
}

// Export validated config values
module.exports = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  // CORS configuration
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
    : ["http://localhost:5173", "http://localhost:3000"],
  // Validate function for external use
  validateEnv,
};

