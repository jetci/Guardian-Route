
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        const incidents = await prisma.incident.findMany({
            take: 5,
            select: {
                id: true,
                title: true,
                location: true
            }
        });

        console.log('Found incidents:', incidents.length);
        incidents.forEach(incident => {
            console.log(`Incident: ${incident.title} (${incident.id})`);
            console.log('Location:', JSON.stringify(incident.location, null, 2));
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
