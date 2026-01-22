const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking incidents in database...\n');
  
  const count = await prisma.incident.count();
  console.log(`📊 Total incidents: ${count}`);
  
  if (count > 0) {
    const incidents = await prisma.incident.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        disasterType: true,
        priority: true,
        status: true,
        location: true,
        address: true,
        reportedAt: true,
      },
      orderBy: {
        reportedAt: 'desc'
      }
    });
    
    console.log('\n📋 Sample incidents:');
    incidents.forEach((inc, i) => {
      console.log(`\n${i + 1}. ${inc.title}`);
      console.log(`   Type: ${inc.disasterType}`);
      console.log(`   Priority: ${inc.priority}`);
      console.log(`   Status: ${inc.status}`);
      console.log(`   Location: ${JSON.stringify(inc.location)}`);
      console.log(`   Address: ${inc.address || 'N/A'}`);
      console.log(`   Reported: ${inc.reportedAt.toISOString()}`);
    });
  } else {
    console.log('\n⚠️  No incidents found in database!');
    console.log('💡 You need to create some incidents first.');
  }
}

main()
  .catch(e => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
