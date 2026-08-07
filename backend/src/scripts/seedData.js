import dotenv from "dotenv";
dotenv.config();

import prisma from "../config/database.js";

const categoriesData = [
  "Starters",
  "Soups",
  "Main Course",
  "Indian",
  "Italian",
  "Chinese",
  "Continental",
  "Beverages",
  "Mocktails",
  "Desserts",
  "Chef's Specials",
];

const menuItemsData = [
  {
    name: "Charcoal Malai Broccoli",
    category: "Starters",
    price: 650,
    description: "Tender broccoli florets marinated in cardamom cream, char-grilled in tandoor.",
    isVeg: true,
    isAvailable: true,
    isFeatured: true,
    prepTime: "15 mins",
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Zaffrani Galouti Kebab",
    category: "Starters",
    price: 850,
    description: "Melt-in-mouth spiced lamb patties infused with saffron and 32 aromatic herbs.",
    isVeg: false,
    isAvailable: true,
    isFeatured: true,
    prepTime: "20 mins",
    imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Truffle Mushroom Consommé",
    category: "Soups",
    price: 590,
    description: "Velvety wild forest mushroom soup finished with white truffle oil and garlic brioche.",
    isVeg: true,
    isAvailable: true,
    isFeatured: false,
    prepTime: "12 mins",
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Royal Dum Biryani (Awadhi)",
    category: "Main Course",
    price: 950,
    description: "Fragrant long-grain basmati rice cooked on slow dum with succulent lamb and saffron.",
    isVeg: false,
    isAvailable: true,
    isFeatured: true,
    prepTime: "25 mins",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Paneer Lababdar Supreme",
    category: "Main Course",
    price: 750,
    description: "Cottage cheese cubes tossed in rich tomato, cashew, and melon seed gravy with fenugreek.",
    isVeg: true,
    isAvailable: true,
    isFeatured: false,
    prepTime: "20 mins",
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Dal Mayura Signature",
    category: "Indian",
    price: 620,
    description: "Black lentils slow-cooked overnight for 24 hours with churned butter and Kashmiri chili.",
    isVeg: true,
    isAvailable: true,
    isFeatured: true,
    prepTime: "15 mins",
    imageUrl: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Butter Chicken Grand Luxe",
    category: "Indian",
    price: 890,
    description: "Tandoori chicken tikka simmered in creamy fenugreek tomato gravy topped with white butter.",
    isVeg: false,
    isAvailable: true,
    isFeatured: true,
    prepTime: "20 mins",
    imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Wood-Fired Truffle Tagliatelle",
    category: "Italian",
    price: 820,
    description: "Handmade pasta tossed in black truffle cream, aged Parmigiano Reggiano, and porcini mushrooms.",
    isVeg: true,
    isAvailable: true,
    isFeatured: true,
    prepTime: "18 mins",
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Artisanal Truffle Dim Sum",
    category: "Chinese",
    price: 720,
    description: "Steamed crystal dumplings stuffed with exotic mushrooms and water chestnuts.",
    isVeg: true,
    isAvailable: true,
    isFeatured: false,
    prepTime: "15 mins",
    imageUrl: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Pan-Seared Chilean Sea Bass",
    category: "Continental",
    price: 1450,
    description: "Wild sea bass served over saffron risotto, baby asparagus, and lemon butter emulsion.",
    isVeg: false,
    isAvailable: true,
    isFeatured: true,
    prepTime: "25 mins",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Kesari Elachi Cocktail",
    category: "Beverages",
    price: 550,
    description: "Craft cocktail with artisanal saffron syrup, cardamom bitters, and edible gold dust.",
    isVeg: true,
    isAvailable: true,
    isFeatured: false,
    prepTime: "8 mins",
    imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Royal Saffron Berry Elixir",
    category: "Mocktails",
    price: 480,
    description: "Refreshing infusion of wild berries, Kashmiri saffron, mint, and sparkling tonic.",
    isVeg: true,
    isAvailable: true,
    isFeatured: false,
    prepTime: "5 mins",
    imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Gold Leaf Shahi Phirni",
    category: "Desserts",
    price: 490,
    description: "Ground rice pudding infused with saffron, green cardamom, topped with silver leaf and roasted pistachios.",
    isVeg: true,
    isAvailable: true,
    isFeatured: true,
    prepTime: "10 mins",
    imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Sous-Vide Wagyu Tenderloin",
    category: "Chef's Specials",
    price: 1850,
    description: "Japanese Wagyu beef steak cooked sous-vide, paired with truffle mash and red wine reduction.",
    isVeg: false,
    isAvailable: true,
    isFeatured: true,
    prepTime: "30 mins",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
  },
];

const tablesData = [
  { tableNumber: "T01", capacity: 2, location: "INDOOR", status: "AVAILABLE" },
  { tableNumber: "T02", capacity: 2, location: "INDOOR", status: "AVAILABLE" },
  { tableNumber: "T03", capacity: 4, location: "INDOOR", status: "AVAILABLE" },
  { tableNumber: "T04", capacity: 4, location: "INDOOR", status: "AVAILABLE" },
  { tableNumber: "T05", capacity: 6, location: "INDOOR", status: "AVAILABLE" },
  { tableNumber: "T06", capacity: 6, location: "INDOOR", status: "AVAILABLE" },
  { tableNumber: "T07", capacity: 8, location: "INDOOR", status: "AVAILABLE" },
  { tableNumber: "T08", capacity: 12, location: "INDOOR", status: "AVAILABLE" },
  { tableNumber: "T09", capacity: 2, location: "OUTDOOR", status: "AVAILABLE" },
  { tableNumber: "T10", capacity: 4, location: "OUTDOOR", status: "AVAILABLE" },
  { tableNumber: "T11", capacity: 6, location: "OUTDOOR", status: "AVAILABLE" },
  { tableNumber: "T12", capacity: 8, location: "OUTDOOR", status: "AVAILABLE" },
];

async function seedData() {
  console.log("🌱 Seeding Categories, Menu Items, Tables, Messages, and Settings...");

  // 1. Seed Categories
  const categoryMap = {};
  for (const catName of categoriesData) {
    let cat = await prisma.menuCategory.findFirst({ where: { name: catName } });
    if (!cat) {
      cat = await prisma.menuCategory.create({ data: { name: catName } });
    }
    categoryMap[catName] = cat.id;
  }

  // 2. Clear & Seed Luxury Menu Items
  await prisma.menuItem.deleteMany();
  for (const item of menuItemsData) {
    await prisma.menuItem.create({
      data: {
        name: item.name,
        categoryId: categoryMap[item.category],
        price: item.price,
        description: item.description,
        isVeg: item.isVeg,
        isAvailable: item.isAvailable,
        isFeatured: item.isFeatured,
        prepTime: item.prepTime,
        imageUrl: item.imageUrl,
      },
    });
  }
  console.log(`✅ Seeded ${menuItemsData.length} Luxury Menu items.`);

  // 3. Seed Tables
  for (const t of tablesData) {
    const existing = await prisma.table.findUnique({ where: { tableNumber: t.tableNumber } });
    if (!existing) {
      await prisma.table.create({ data: t });
    }
  }
  console.log(`✅ Seeded ${tablesData.length} Tables.`);

  console.log("🎉 Seeding completed successfully!");
  process.exit(0);
}

seedData().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
