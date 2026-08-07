import prisma from "../config/database.js";

const DEFAULT_SETTINGS = {
  restaurantName: "Mayura Fine Cuisine",
  tagline: "Authentic Royal Indian Dining",
  description: "An extraordinary culinary journey blending royal Indian heritage with modern gastronomy.",
  phone: "+91 98765 43210",
  email: "contact@mayurafinecuisine.com",
  address: "Plot 42, Executive Enclave, Golf Course Road, Gurgaon, Haryana 122002",
  openingTime: "11:00 AM",
  closingTime: "11:30 PM",
  weekendHours: "11:00 AM - 12:00 AM",
  instagram: "https://instagram.com/mayurafinecuisine",
  facebook: "https://facebook.com/mayurafinecuisine",
  twitter: "https://twitter.com/mayura_cuisine",
  tripadvisor: "https://tripadvisor.com/mayura",
  maxGuestsPerTable: 12,
  reservationNoticeHours: 2,
  advanceBookingDays: 30,
  heroTitle: "Taste of Royal Heritage",
  heroSubtitle: "Experience extraordinary flavors crafted with passion, tradition, and culinary artistry.",
  footerCopyright: "© 2026 Mayura Fine Cuisine. All rights reserved.",
  footerAbout: "Mayura Fine Cuisine represents the pinnacle of royal Indian dining, offering authentic recipes crafted with finest ingredients.",
};

export async function getSettings() {
  let settings = await prisma.restaurantSettings.findFirst();
  if (!settings) {
    settings = await prisma.restaurantSettings.create({
      data: DEFAULT_SETTINGS,
    });
  }
  return settings;
}

export async function updateSettings(data) {
  let settings = await prisma.restaurantSettings.findFirst();

  const updateData = {};
  const fields = [
    "restaurantName",
    "tagline",
    "description",
    "logoUrl",
    "phone",
    "email",
    "address",
    "openingTime",
    "closingTime",
    "weekendHours",
    "instagram",
    "facebook",
    "twitter",
    "tripadvisor",
    "heroTitle",
    "heroSubtitle",
    "heroImageUrl",
    "footerCopyright",
    "footerAbout",
  ];

  fields.forEach((f) => {
    if (data[f] !== undefined) updateData[f] = data[f];
  });

  if (data.maxGuestsPerTable !== undefined) {
    updateData.maxGuestsPerTable = Number(data.maxGuestsPerTable);
  }
  if (data.reservationNoticeHours !== undefined) {
    updateData.reservationNoticeHours = Number(data.reservationNoticeHours);
  }
  if (data.advanceBookingDays !== undefined) {
    updateData.advanceBookingDays = Number(data.advanceBookingDays);
  }

  if (settings) {
    settings = await prisma.restaurantSettings.update({
      where: { id: settings.id },
      data: updateData,
    });
  } else {
    settings = await prisma.restaurantSettings.create({
      data: { ...DEFAULT_SETTINGS, ...updateData },
    });
  }
  return settings;
}
