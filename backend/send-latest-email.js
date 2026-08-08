import prisma from "./src/config/database.js";
import { sendReservationConfirmation } from "./src/services/email.service.js";

async function sendLatestReservationEmail() {
  console.log("🔍 Fetching latest reservation from database...");
  const latest = await prisma.reservation.findFirst({
    orderBy: { createdAt: "desc" },
  });

  if (!latest) {
    console.log("❌ No reservations found in database.");
    return null;
  }

  console.log(`📋 Found latest reservation:`);
  console.log(`   - Name: ${latest.name}`);
  console.log(`   - Email: ${latest.email}`);
  console.log(`   - Date: ${latest.reservationDate?.toISOString()}`);
  console.log(`   - Time: ${latest.reservationTime}`);
  console.log(`   - Created At: ${latest.createdAt?.toISOString()}`);
  console.log("\n📧 Dispatching confirmation email...");

  const result = await sendReservationConfirmation(latest);
  console.log(`✅ Dispatch result: ${result}`);
  return latest;
}

sendLatestReservationEmail()
  .catch((err) => console.error("❌ Error executing script:", err))
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
