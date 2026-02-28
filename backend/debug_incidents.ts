
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');

        console.log('Attempting to run IncidentsService.findAll query...');
        const incidents = await prisma.incident.findMany({
            include: {
                createdBy: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                    },
                },
                village: true,
                _count: {
                    select: {
                        tasks: true,
                        surveys: true,
                        reports: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        console.log(`Success! Found ${incidents.length} incidents.`);
        if (incidents.length > 0) {
            console.log('Sample incident:', JSON.stringify(incidents[0], null, 2));
        }

    } catch (error) {
        console.error('❌ Error executing query:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
