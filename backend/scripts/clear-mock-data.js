const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearMockData() {
    console.log('🗑️  Starting to clear mock data...');

    try {
        // Delete in order of dependencies (Child -> Parent)

        // 1. Delete Field Surveys
        const deletedSurveys = await prisma.fieldSurvey.deleteMany({});
        console.log(`✅ Deleted ${deletedSurveys.count} Field Surveys`);

        // 2. Delete Tasks
        const deletedTasks = await prisma.task.deleteMany({});
        console.log(`✅ Deleted ${deletedTasks.count} Tasks`);

        // 3. Delete Incidents
        const deletedIncidents = await prisma.incident.deleteMany({});
        console.log(`✅ Deleted ${deletedIncidents.count} Incidents`);

        console.log('\n✨ All mock data cleared successfully!');
    } catch (error) {
        console.error('❌ Error clearing data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearMockData();
