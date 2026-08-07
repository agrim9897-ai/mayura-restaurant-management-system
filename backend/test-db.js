import prisma, { connectDatabase, disconnectDatabase } from './src/config/database.js';

async function testPrisma() {
  console.log('--- Testing Database Connection ---');
  const connected = await connectDatabase();
  console.log('Database connected status:', connected);

  console.log('--- Testing Prisma Client Initialization ---');
  console.log('Prisma Client Instance:', !!prisma);

  console.log('--- Executing Test Query via Prisma ---');
  try {
    const result = await prisma.$queryRawUnsafe('SELECT 1 as connection_test');
    console.log('Prisma Query Result:', result);
  } catch (error) {
    console.error('Prisma Query Failed:', error);
  } finally {
    await disconnectDatabase();
  }
}

testPrisma();
