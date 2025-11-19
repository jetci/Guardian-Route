const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function installPostGIS() {
  console.log('📦 Installing PostGIS Extension...\n');

  try {
    // Enable PostGIS extension
    await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS postgis;');
    console.log('✅ PostGIS extension installed successfully!');
    console.log('');

    // Verify installation
    const version = await prisma.$queryRaw`SELECT PostGIS_version() as version;`;
    console.log('✅ PostGIS Version:', version[0]?.version);
    console.log('');

    console.log('🎉 PostGIS is ready to use!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
    console.log('💡 Manual Installation:');
    console.log('   1. Open pgAdmin or psql');
    console.log('   2. Connect to guardian_route database');
    console.log('   3. Run: CREATE EXTENSION IF NOT EXISTS postgis;');
  } finally {
    await prisma.$disconnect();
  }
}

installPostGIS();
