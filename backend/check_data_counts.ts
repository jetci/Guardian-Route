
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');

        const incidentCount = await prisma.incident.count();
        console.log(`Found ${incidentCount} incidents.`);

        if (incidentCount > 0) {
            const incidents = await prisma.incident.findMany({
                take: 5,
                select: { id: true, title: true, location: true }
            });
            console.log('Sample Incidents:', JSON.stringify(incidents, null, 2));
        }

        const fieldSurveyCount = await prisma.fieldSurvey.count();
        console.log(`Found ${fieldSurveyCount} field surveys.`);

        if (fieldSurveyCount > 0) {
            const surveys = await prisma.fieldSurvey.findMany({
                take: 5,
                select: { id: true, gpsLocation: true }
            });
            console.log('Sample Field Surveys:', JSON.stringify(surveys, null, 2));
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
