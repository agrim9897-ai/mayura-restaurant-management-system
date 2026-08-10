import dotenv from "dotenv";
dotenv.config();

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  email: {
    smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
    smtpPort: parseInt(process.env.SMTP_PORT, 10) || 465,
    smtpSecure: process.env.SMTP_SECURE !== undefined ? process.env.SMTP_SECURE === "true" : true,
    smtpUser: process.env.SMTP_USER || process.env.EMAIL_USER,
    smtpPass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
  },
};

export default config;
