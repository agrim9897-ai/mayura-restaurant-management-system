// Test all 5 reservation endpoints
const BASE = "http://localhost:5000/api/reservations";

async function test() {
  let createdId;

  // ── 1. POST /api/reservations ──────────────────
  console.log("\n═══ TEST 1: POST /api/reservations ═══");
  const createRes = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Agrim Sharma",
      email: "agrim@example.com",
      phone: "9876543210",
      reservationDate: "2026-08-10",
      reservationTime: "19:30",
      guests: 4,
      occasion: "Birthday",
      seatingPreference: "Window",
    }),
  });
  const createData = await createRes.json();
  console.log("Status:", createRes.status);
  console.log("Response:", JSON.stringify(createData, null, 2));
  createdId = createData.data?.id;

  // ── 2. POST with invalid data (validation test) ──
  console.log("\n═══ TEST 2: POST with invalid data ═══");
  const invalidRes = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "A" }),
  });
  const invalidData = await invalidRes.json();
  console.log("Status:", invalidRes.status);
  console.log("Response:", JSON.stringify(invalidData, null, 2));

  // ── 3. GET /api/reservations ───────────────────
  console.log("\n═══ TEST 3: GET /api/reservations ═══");
  const allRes = await fetch(BASE);
  const allData = await allRes.json();
  console.log("Status:", allRes.status);
  console.log("Count:", allData.data?.length);
  console.log("Response:", JSON.stringify(allData, null, 2));

  // ── 4. GET /api/reservations/:id ───────────────
  console.log("\n═══ TEST 4: GET /api/reservations/:id ═══");
  const oneRes = await fetch(`${BASE}/${createdId}`);
  const oneData = await oneRes.json();
  console.log("Status:", oneRes.status);
  console.log("Response:", JSON.stringify(oneData, null, 2));

  // ── 5. GET with bad ID (404 test) ──────────────
  console.log("\n═══ TEST 5: GET with non-existent ID ═══");
  const notFoundRes = await fetch(`${BASE}/non-existent-id`);
  const notFoundData = await notFoundRes.json();
  console.log("Status:", notFoundRes.status);
  console.log("Response:", JSON.stringify(notFoundData, null, 2));

  // ── 6. PUT /api/reservations/:id ───────────────
  console.log("\n═══ TEST 6: PUT /api/reservations/:id ═══");
  const updateRes = await fetch(`${BASE}/${createdId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "CONFIRMED" }),
  });
  const updateData = await updateRes.json();
  console.log("Status:", updateRes.status);
  console.log("Response:", JSON.stringify(updateData, null, 2));

  // ── 7. PUT with invalid status ─────────────────
  console.log("\n═══ TEST 7: PUT with invalid status ═══");
  const badStatusRes = await fetch(`${BASE}/${createdId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "INVALID" }),
  });
  const badStatusData = await badStatusRes.json();
  console.log("Status:", badStatusRes.status);
  console.log("Response:", JSON.stringify(badStatusData, null, 2));

  // ── 8. DELETE /api/reservations/:id ────────────
  console.log("\n═══ TEST 8: DELETE /api/reservations/:id ═══");
  const deleteRes = await fetch(`${BASE}/${createdId}`, { method: "DELETE" });
  const deleteData = await deleteRes.json();
  console.log("Status:", deleteRes.status);
  console.log("Response:", JSON.stringify(deleteData, null, 2));

  // ── 9. GET after delete (confirm gone) ─────────
  console.log("\n═══ TEST 9: GET deleted reservation (should be 404) ═══");
  const goneRes = await fetch(`${BASE}/${createdId}`);
  const goneData = await goneRes.json();
  console.log("Status:", goneRes.status);
  console.log("Response:", JSON.stringify(goneData, null, 2));

  console.log("\n═══ ALL TESTS COMPLETE ═══\n");
}

test();
