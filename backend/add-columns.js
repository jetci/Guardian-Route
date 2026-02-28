const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Adding missing columns...');
  
  await prisma.$executeRawUnsafe(`
    ALTER TABLE villages ADD COLUMN IF NOT EXISTS population_female INTEGER;
  `);
  
  await prisma.$executeRawUnsafe(`
    ALTER TABLE villages ADD COLUMN IF NOT EXISTS population_male INTEGER;
  `);
  
  await prisma.$executeRawUnsafe(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_required BOOLEAN DEFAULT false;
  `);
  
  console.log('✅ All columns added successfully!');
}

main()
  .catch(e => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
