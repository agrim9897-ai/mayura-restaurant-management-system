import app from "./app.js";
import config from "./config/index.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { verifySmtpConnection } from "./services/email.service.js";

const startServer = async () => {
  // Verify database connection before accepting requests
  await connectDatabase();

  // Verify Gmail SMTP authentication
  await verifySmtpConnection();

  const server = app.listen(config.port, () => {
    console.log(`\n🚀 Mayura Backend running on http://localhost:${config.port}`);
    console.log(`📍 Environment: ${config.nodeEnv}`);
    console.log(`❤️  Health check: http://localhost:${config.port}/api/health\n`);
  });

  // ──────────────────────────────────────────────
  //  Graceful Shutdown
  // ──────────────────────────────────────────────

  const shutdown = async (signal) => {
    console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      console.log("👋 Server closed.");
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

startServer();
