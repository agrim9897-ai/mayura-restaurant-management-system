import prisma from "../config/database.js";

export async function getAllMessages() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return messages.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone || "",
    message: m.message,
    date: m.createdAt ? String(m.createdAt).split("T")[0] : "",
    isRead: true, // Default to true or add column if needed
  }));
}

export async function createContactMessage(data) {
  const msg = await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
    },
  });

  return {
    id: msg.id,
    name: msg.name,
    email: msg.email,
    phone: msg.phone || "",
    message: msg.message,
    date: String(msg.createdAt).split("T")[0],
    isRead: false,
  };
}

export async function deleteMessage(id) {
  return await prisma.contactMessage.delete({
    where: { id },
  });
}
