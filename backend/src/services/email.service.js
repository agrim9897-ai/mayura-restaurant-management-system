import nodemailer from "nodemailer";
import config from "../config/index.js";

/**
 * Creates Nodemailer transporter for Gmail SMTP using env credentials.
 */
const createTransporter = () => {
  if (!config.email.user || !config.email.pass || config.email.user.includes("your_gmail")) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });
};

/**
 * Sends a reservation confirmation email to the guest.
 *
 * NOTE: If email sending fails, it logs the error and resolves safely
 * so the database reservation is NOT affected or rolled back.
 *
 * @param {Object} reservation - The saved reservation object from Prisma
 * @returns {Promise<boolean>} True if sent successfully, false otherwise
 */
export async function sendReservationConfirmation(reservation) {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.warn(
        `⚠️  Email service notice: EMAIL_USER / EMAIL_PASS not configured in .env. Skipping confirmation email for ${reservation.email}.`
      );
      return false;
    }

    // Format reservation date to readable string if it's a Date object
    const formattedDate =
      reservation.reservationDate instanceof Date
        ? reservation.reservationDate.toISOString().split("T")[0]
        : String(reservation.reservationDate).split("T")[0];

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reservation Confirmation — Mayura Fine Cuisine</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #0f0e0c;
      color: #e5e0d8;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #171614;
      border: 1px solid #d4af37;
      border-radius: 12px;
      padding: 40px 30px;
    }
    .header {
      text-align: center;
      border-bottom: 1px solid #2a2721;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo-text {
      color: #d4af37;
      font-size: 26px;
      font-weight: bold;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin: 0;
    }
    .subtitle {
      color: #a0998e;
      font-size: 13px;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-top: 5px;
    }
    h2 {
      color: #f0e6d2;
      font-size: 20px;
      margin-top: 0;
    }
    p {
      line-height: 1.6;
      color: #c5beb3;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin: 25px 0;
      background-color: #0f0e0c;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #2a2721;
    }
    .details-table td {
      padding: 12px 18px;
      border-bottom: 1px solid #2a2721;
      font-size: 14px;
    }
    .details-table tr:last-child td {
      border-bottom: none;
    }
    .label {
      color: #d4af37;
      font-weight: 600;
      width: 40%;
    }
    .value {
      color: #ffffff;
    }
    .footer {
      text-align: center;
      margin-top: 35px;
      padding-top: 20px;
      border-top: 1px solid #2a2721;
      color: #8a8377;
      font-size: 12px;
    }
    .gold-accent {
      color: #d4af37;
    }
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
    <p>Thank you for choosing Mayura Fine Cuisine. We are delighted to confirm your table reservation. Here are the details of your upcoming visit:</p>

    <table class="details-table">
      <tr>
        <td class="label">Guest Name</td>
        <td class="value">${reservation.name}</td>
      </tr>
      <tr>
        <td class="label">Reservation Date</td>
        <td class="value">${formattedDate}</td>
      </tr>
      <tr>
        <td class="label">Reservation Time</td>
        <td class="value">${reservation.reservationTime}</td>
      </tr>
      <tr>
        <td class="label">Number of Guests</td>
        <td class="value">${reservation.guests} ${reservation.guests === 1 ? "Guest" : "Guests"}</td>
      </tr>
      <tr>
        <td class="label">Occasion</td>
        <td class="value">${reservation.occasion || "Standard Dining"}</td>
      </tr>
      ${
        reservation.seatingPreference
          ? `
      <tr>
        <td class="label">Seating Preference</td>
        <td class="value">${reservation.seatingPreference}</td>
      </tr>`
          : ""
      }
    </table>

    <p>We look forward to creating an extraordinary culinary experience for you and your guests.</p>
    <p>If you need to modify or cancel your reservation, please contact us directly at least 2 hours prior to your scheduled time.</p>

    <div class="footer">
      <p>Warm regards,<br><strong class="gold-accent">Mayura Fine Cuisine Team</strong></p>
      <p style="margin-top: 15px;">Reservations are held for 15 minutes after scheduled time.</p>
    </div>
  </div>
</body>
</html>
    `;

    const mailOptions = {
      from: `"Mayura Fine Cuisine" <${config.email.user}>`,
      to: reservation.email,
      subject: `Table Reservation Confirmed — Mayura Fine Cuisine`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Confirmation email successfully sent to ${reservation.email} (Message ID: ${info.messageId})`);
    return true;
  } catch (error) {
    console.error(`⚠️  Failed to send confirmation email to ${reservation.email}:`, error.message);
    // Do NOT throw error — reservation is already saved successfully in PostgreSQL
    return false;
  }
}
