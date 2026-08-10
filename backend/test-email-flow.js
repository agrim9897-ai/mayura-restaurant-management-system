import { sendEmail, verifySmtpConnection } from "./src/services/email.service.js";

async function testGmailSmtpService() {
  console.log("--- 1. Testing Gmail SMTP Connection Verification ---");
  const isVerified = await verifySmtpConnection();
  
  if (!isVerified) {
    console.error("❌ Verification failed. Aborting email test.");
    process.exit(1);
  }

  const recipient = process.argv[2] || "agrim9897@gmail.com";
  console.log(`\n--- 2. Sending Test Email via Gmail SMTP to ${recipient} ---`);
  
  const result = await sendEmail({
    to: recipient,
    subject: "Mayura SMTP Test",
    text: "This is a test email from Mayura using Gmail SMTP.",
    html: "<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #d4af37;'><h2 style='color: #d4af37;'>Mayura Fine Cuisine</h2><p>This is a test email from Mayura using Gmail SMTP.</p></div>",
    fromName: "Mayura Fine Cuisine",
  });

  console.log("\n--- 3. Email Dispatch Result ---");
  console.log("Success:", result.success);
  if (result.messageId) {
    console.log("Message ID:", result.messageId);
  }
  if (result.error) {
    console.error("Error:", result.error);
  }
}

testGmailSmtpService();
