import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const incidents = await prisma.incident.findMany({
            select: {
                id: true,
                title: true,
                location: true,
            },
            take: 5,
        });

        console.log('--- Incident Debug Data ---');
        incidents.forEach(incident => {
            console.log(`ID: ${incident.id}`);
            console.log(`Title: ${incident.title}`);
            console.log(`Location:`, JSON.stringify(incident.location, null, 2));
            console.log('---------------------------');
        });
    } catch (error) {
        console.error('Error fetching incidents:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
