const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Adding all missing columns...\n');
  
  // Villages columns
  console.log('📍 Villages table...');
  await prisma.$executeRawUnsafe(`ALTER TABLE villages ADD COLUMN IF NOT EXISTS population_female INTEGER;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE villages ADD COLUMN IF NOT EXISTS population_male INTEGER;`);
  console.log('  ✅ Villages columns added\n');
  
  // Users columns
  console.log('👥 Users table...');
  await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_required BOOLEAN DEFAULT false;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_expires_at TIMESTAMP;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_last_changed TIMESTAMP;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS backup_codes TEXT[] DEFAULT '{}';`);
  await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT false;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_enabled_at TIMESTAMP;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_secret TEXT;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_attempt TIMESTAMP;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_ip TEXT;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_success TIMESTAMP;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS login_attempts INTEGER DEFAULT 0;`);
  console.log('  ✅ Users columns added\n');
  
  // Incidents columns
  console.log('🚨 Incidents table...');
  await prisma.$executeRawUnsafe(`ALTER TABLE incidents ADD COLUMN IF NOT EXISTS affected_area JSONB;`);
  console.log('  ✅ Incidents columns added\n');
  
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
