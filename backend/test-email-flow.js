import { sendReservationConfirmation, sendEmail } from "./src/services/email.service.js";

async function testEmailService() {
  console.log("--- Testing Email Service direct call with mock reservation ---");

  const mockReservation = {
    id: "test-uuid-1234",
    name: "John Doe",
    email: "delivered@resend.dev", // Resend test recipient or user email
    phone: "9876543210",
    reservationDate: new Date("2026-08-20"),
    reservationTime: "19:30",
    guests: 4,
    occasion: "Anniversary",
    seatingPreference: "Window",
    status: "PENDING",
    createdAt: new Date(),
  };

  const result = await sendReservationConfirmation(mockReservation);
  console.log("Email dispatch completed. Success status:", result);
}

testEmailService();
