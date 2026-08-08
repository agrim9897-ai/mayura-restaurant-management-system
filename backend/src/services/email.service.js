import dotenv from "dotenv";
import config from "../config/index.js";

// Ensure environment variables are fresh
dotenv.config();

/**
 * Gets sender address object for Brevo API.
 */
function getSenderInfo(fromName = "Mayura Fine Cuisine") {
  const senderEmail =
    process.env.BREVO_SENDER_EMAIL ||
    config.email?.brevoSenderEmail ||
    process.env.EMAIL_USER ||
    config.email?.user ||
    "aimodel422@gmail.com";

  return {
    name: fromName,
    email: senderEmail.trim(),
  };
}

/**
 * Core reusable email sending helper via Brevo HTTP API.
 */
export async function sendEmail({ to, subject, html, fromName = "Mayura Fine Cuisine" }) {
  const apiKey = process.env.BREVO_API_KEY || config.email?.brevoApiKey;
  if (!apiKey || !apiKey.trim()) {
    console.warn(`⚠️ Email service notice: BREVO_API_KEY not configured in .env. Skipping email to ${to}.`);
    return { success: false, reason: "MISSING_API_KEY" };
  }

  const sender = getSenderInfo(fromName);
  const recipientList = Array.isArray(to)
    ? to.map((email) => ({ email: email.trim() }))
    : [{ email: to.trim() }];

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey.trim(),
      },
      body: JSON.stringify({
        sender,
        to: recipientList,
        subject,
        htmlContent: html,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.code) {
      const errorMsg = data.message || `HTTP ${response.status} ${response.statusText}`;
      console.error(`❌ Brevo API Error sending to ${to}: ${errorMsg}`);
      return { success: false, error: errorMsg, code: data.code };
    }

    const messageId = data.messageId;
    console.log(`📧 Email successfully sent via Brevo API to ${to} (Message ID: ${messageId})`);
    return { success: true, messageId, data };
  } catch (error) {
    console.error(`❌ Unexpected error sending email via Brevo to ${to}:`, error.message || error);
    return { success: false, error: error.message };
  }
}

/**
 * Sends a reservation confirmation email to the guest.
 */
export async function sendReservationConfirmation(reservation) {
  try {
    const formattedDate =
      reservation.reservationDate instanceof Date
        ? reservation.reservationDate.toISOString().split("T")[0]
        : String(reservation.reservationDate).split("T")[0];

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reservation Confirmed — Mayura Fine Cuisine</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0f0e0c; color: #e5e0d8; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #171614; border: 1px solid #d4af37; border-radius: 12px; padding: 40px 30px; }
    .header { text-align: center; border-bottom: 1px solid #2a2721; padding-bottom: 20px; margin-bottom: 30px; }
    .logo-text { color: #d4af37; font-size: 26px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0; }
    .subtitle { color: #a0998e; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; margin-top: 5px; }
    h2 { color: #f0e6d2; font-size: 20px; margin-top: 0; }
    p { line-height: 1.6; color: #c5beb3; }
    .details-table { width: 100%; border-collapse: collapse; margin: 25px 0; background-color: #0f0e0c; border-radius: 8px; overflow: hidden; border: 1px solid #2a2721; }
    .details-table td { padding: 12px 18px; border-bottom: 1px solid #2a2721; font-size: 14px; }
    .details-table tr:last-child td { border-bottom: none; }
    .label { color: #d4af37; font-weight: 600; width: 40%; }
    .value { color: #ffffff; }
    .footer { text-align: center; margin-top: 35px; padding-top: 20px; border-top: 1px solid #2a2721; color: #8a8377; font-size: 12px; }
    .gold-accent { color: #d4af37; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">MAYURA</div>
      <div class="subtitle">Fine Cuisine</div>
    </div>
    <h2>Reservation Confirmed</h2>
    <p>Dear <strong class="gold-accent">${reservation.name}</strong>,</p>
    <p>Thank you for choosing Mayura Fine Cuisine. We are delighted to confirm your table reservation. Here are your booking details:</p>
    <table class="details-table">
      <tr><td class="label">Guest Name</td><td class="value">${reservation.name}</td></tr>
      <tr><td class="label">Reservation Date</td><td class="value">${formattedDate}</td></tr>
      <tr><td class="label">Reservation Time</td><td class="value">${reservation.reservationTime || reservation.time}</td></tr>
      <tr><td class="label">Number of Guests</td><td class="value">${reservation.guests} Guests</td></tr>
      <tr><td class="label">Occasion</td><td class="value">${reservation.occasion || "Standard Dining"}</td></tr>
      ${reservation.seatingPreference ? `<tr><td class="label">Seating Preference</td><td class="value">${reservation.seatingPreference}</td></tr>` : ""}
    </table>
    <p>We look forward to creating an extraordinary culinary experience for you and your guests.</p>
    <div class="footer">
      <p>Warm regards,<br><strong class="gold-accent">Mayura Fine Cuisine Team</strong></p>
    </div>
  </div>
</body>
</html>
    `;

    const result = await sendEmail({
      to: reservation.email,
      subject: `Table Reservation Confirmed — Mayura Fine Cuisine`,
      html: htmlContent,
      fromName: "Mayura Fine Cuisine",
    });

    return result.success;
  } catch (error) {
    console.error(`⚠️ Failed to send confirmation email to ${reservation.email}:`, error.message);
    return false;
  }
}

/**
 * Sends a reservation cancellation email to the guest.
 */
export async function sendReservationCancellation(reservation) {
  try {
    const formattedDate =
      reservation.reservationDate instanceof Date
        ? reservation.reservationDate.toISOString().split("T")[0]
        : String(reservation.reservationDate).split("T")[0];

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reservation Cancelled — Mayura Fine Cuisine</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0f0e0c; color: #e5e0d8; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #171614; border: 1px solid #d4af37; border-radius: 12px; padding: 40px 30px; }
    .header { text-align: center; border-bottom: 1px solid #2a2721; padding-bottom: 20px; margin-bottom: 30px; }
    .logo-text { color: #d4af37; font-size: 26px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0; }
    .footer { text-align: center; margin-top: 35px; padding-top: 20px; border-top: 1px solid #2a2721; color: #8a8377; font-size: 12px; }
    .gold-accent { color: #d4af37; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">MAYURA</div>
      <div style="color: #a0998e; font-size: 13px; text-transform: uppercase; margin-top: 5px;">Fine Cuisine</div>
    </div>
    <h2 style="color: #e57373;">Reservation Cancelled</h2>
    <p>Dear <strong class="gold-accent">${reservation.name}</strong>,</p>
    <p>Your table reservation for <strong>${formattedDate} at ${reservation.reservationTime || reservation.time}</strong> has been cancelled.</p>
    <p>If this was a mistake or you wish to reschedule, please feel free to make a new booking on our website or contact us directly.</p>
    <div class="footer">
      <p>Warm regards,<br><strong class="gold-accent">Mayura Reservations Team</strong></p>
    </div>
  </div>
</body>
</html>
    `;

    const result = await sendEmail({
      to: reservation.email,
      subject: `Reservation Cancellation Notice — Mayura Fine Cuisine`,
      html: htmlContent,
      fromName: "Mayura Fine Cuisine",
    });

    return result.success;
  } catch (error) {
    console.error(`⚠️ Failed to send cancellation email to ${reservation.email}:`, error.message);
    return false;
  }
}

/**
 * Sends a thank-you email when a reservation is marked as COMPLETED.
 */
export async function sendReservationCompletion(reservation) {
  try {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Thank You for Dining with Us — Mayura Fine Cuisine</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0f0e0c; color: #e5e0d8; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #171614; border: 1px solid #d4af37; border-radius: 12px; padding: 40px 30px; }
    .header { text-align: center; border-bottom: 1px solid #2a2721; padding-bottom: 20px; margin-bottom: 30px; }
    .logo-text { color: #d4af37; font-size: 26px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0; }
    .footer { text-align: center; margin-top: 35px; padding-top: 20px; border-top: 1px solid #2a2721; color: #8a8377; font-size: 12px; }
    .gold-accent { color: #d4af37; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">MAYURA</div>
      <div style="color: #a0998e; font-size: 13px; text-transform: uppercase; margin-top: 5px;">Fine Cuisine</div>
    </div>
    <h2 style="color: #d4af37;">Thank You for Dining with Us!</h2>
    <p>Dear <strong class="gold-accent">${reservation.name}</strong>,</p>
    <p>It was our absolute pleasure hosting you at Mayura Fine Cuisine. We hope your dining experience was memorable and delightful.</p>
    <p>We look forward to welcoming you back soon for another extraordinary culinary journey.</p>
    <div class="footer">
      <p>Warmest regards,<br><strong class="gold-accent">Mayura Executive Chef & Team</strong></p>
    </div>
  </div>
</body>
</html>
    `;

    const result = await sendEmail({
      to: reservation.email,
      subject: `Thank You for Dining with Us — Mayura Fine Cuisine`,
      html: htmlContent,
      fromName: "Mayura Fine Cuisine",
    });

    return result.success;
  } catch (error) {
    console.error(`⚠️ Failed to send completion email to ${reservation.email}:`, error.message);
    return false;
  }
}

/**
 * Sends a reply email to a customer inquiry from the admin dashboard inbox.
 */
export async function sendReplyEmail({ to, subject, replyText }) {
  try {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0f0e0c; color: #e5e0d8; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #171614; border: 1px solid #d4af37; border-radius: 12px; padding: 40px 30px; }
    .header { text-align: center; border-bottom: 1px solid #2a2721; padding-bottom: 20px; margin-bottom: 30px; }
    .logo-text { color: #d4af37; font-size: 24px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; }
    .subtitle { color: #a0998e; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; margin-top: 4px; }
    .content { color: #f0e6d2; font-size: 15px; line-height: 1.7; white-space: pre-line; margin-top: 20px; }
    .footer { text-align: center; margin-top: 35px; padding-top: 20px; border-top: 1px solid #2a2721; color: #8a8377; font-size: 12px; }
    .gold-accent { color: #d4af37; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">MAYURA</div>
      <div class="subtitle">Fine Cuisine</div>
    </div>
    <div class="content">
      ${replyText}
    </div>
    <div class="footer">
      <p>Warm regards,<br><strong class="gold-accent">Mayura Guest Relations Team</strong></p>
      <p style="margin-top: 10px;">Executive Enclave, Golf Course Road, Gurgaon</p>
    </div>
  </div>
</body>
</html>
    `;

    const result = await sendEmail({
      to,
      subject,
      html: htmlContent,
      fromName: "Mayura Guest Relations",
    });

    return result.success;
  } catch (error) {
    console.error(`⚠️ Failed to send reply email to ${to}:`, error.message);
    return false;
  }
}

/**
 * Sends a password reset email to an administrator.
 */
export async function sendPasswordResetEmail({ to, resetUrl }) {
  try {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Your Password — Mayura Fine Cuisine</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0f0e0c; color: #e5e0d8; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #171614; border: 1px solid #d4af37; border-radius: 12px; padding: 40px 30px; }
    .header { text-align: center; border-bottom: 1px solid #2a2721; padding-bottom: 20px; margin-bottom: 30px; }
    .logo-text { color: #d4af37; font-size: 26px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0; }
    .subtitle { color: #a0998e; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; margin-top: 5px; }
    h2 { color: #f0e6d2; font-size: 20px; margin-top: 0; }
    p { line-height: 1.6; color: #c5beb3; font-size: 14px; }
    .btn-container { text-align: center; margin: 30px 0; }
    .btn { display: inline-block; padding: 14px 32px; background-color: #d4af37; color: #0f0e0c !important; font-weight: bold; font-size: 14px; text-decoration: none; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px; }
    .notice { background-color: #0f0e0c; border-left: 3px solid #d4af37; padding: 12px 16px; margin: 20px 0; font-size: 13px; color: #a0998e; }
    .footer { text-align: center; margin-top: 35px; padding-top: 20px; border-top: 1px solid #2a2721; color: #8a8377; font-size: 12px; }
    .gold-accent { color: #d4af37; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">MAYURA</div>
      <div class="subtitle">Admin Security Center</div>
    </div>
    <h2>Password Reset Request</h2>
    <p>Hello Administrator,</p>
    <p>We received a request to reset the password for your Mayura Admin Portal account. Click the button below to set a new password:</p>
    
    <div class="btn-container">
      <a href="${resetUrl}" target="_blank" class="btn">Reset Password</a>
    </div>

    <div class="notice">
      <strong>⚠️ Expiration Notice:</strong> This password reset link is valid for <strong>15 minutes</strong> only and can be used once.
    </div>

    <p style="font-size: 13px; color: #8a8377;">
      If you did not request this password reset, please ignore this email. Your password will remain unchanged and your account stays secure.
    </p>

    <div class="footer">
      <p>Mayura Fine Cuisine — Executive Portal<br><strong class="gold-accent">Automated Security Service</strong></p>
    </div>
  </div>
</body>
</html>
    `;

    const result = await sendEmail({
      to,
      subject: `Reset Your Admin Password — Mayura Fine Cuisine`,
      html: htmlContent,
      fromName: "Mayura Security",
    });

    return result.success;
  } catch (error) {
    console.error(`⚠️ Failed to send password reset email to ${to}:`, error.message);
    return false;
  }
}
