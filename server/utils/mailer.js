let nodemailer = null;
try {
  nodemailer = require("nodemailer");
} catch (e) {
  // Module not installed; will use console fallback
  nodemailer = null;
}

function createTransport() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    MAIL_FROM,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    // Fallback transport that logs emails to console (dev mode)
    return {
      sendMail: async (opts) => {
        const from = MAIL_FROM || "no-reply@example.com";
        // eslint-disable-next-line no-console
        console.log("📧 [DEV MAIL]", {
          from,
          to: opts.to,
          subject: opts.subject,
          text: opts.text,
          html: opts.html,
        });
        return { messageId: `dev-${Date.now()}` };
      },
    };
  }

  if (!nodemailer) {
    return {
      sendMail: async (opts) => {
        const from = MAIL_FROM || "no-reply@example.com";
        // eslint-disable-next-line no-console
        console.log("📧 [DEV MAIL - no nodemailer]", {
          from,
          to: opts.to,
          subject: opts.subject,
          text: opts.text,
          html: opts.html,
        });
        return { messageId: `dev-${Date.now()}` };
      },
    };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE || "false").toLowerCase() === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    logger: process.env.NODE_ENV !== "production",
    debug: process.env.NODE_ENV !== "production",
  });

  return transporter;
}

const transporter = createTransport();

async function sendMail({ to, subject, text, html }) {
  const from = process.env.MAIL_FROM || "Finance Tracker <no-reply@financetracker.local>";
  try {
    // Verify connection in development once per process
    if (!sendMail._verified && process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("📡 Verifying SMTP connection...", {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        user: process.env.SMTP_USER,
      });
      await transporter.verify();
      sendMail._verified = true;
      // eslint-disable-next-line no-console
      console.log("✅ SMTP verified successfully");
    }

    const info = await transporter.sendMail({ from, to, subject, text, html });
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("📧 Mail sent", {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
      });
    }
    return info;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("❌ Mail send error", err);
    throw err;
  }
}

async function sendResetCodeEmail(to, code) {
  const subject = "Mã đặt lại mật khẩu";
  const text = `Mã xác thực đặt lại mật khẩu của bạn là: ${code}. Mã sẽ hết hạn sau 10 phút.`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6">
      <h2>Đặt lại mật khẩu</h2>
      <p>Mã xác thực của bạn là:</p>
      <div style="font-size: 24px; font-weight: bold; letter-spacing: 4px">${code}</div>
      <p>Mã có hiệu lực trong <strong>10 phút</strong>. Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
    </div>
  `;
  return sendMail({ to, subject, text, html });
}

module.exports = {
  sendMail,
  sendResetCodeEmail,
};


