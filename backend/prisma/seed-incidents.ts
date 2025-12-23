/**
 * Seed script for generating test incidents
 * Sprint 2 Week 1 - QA Test Data
 * 
 * Usage: npx ts-node prisma/seed-incidents.ts
 */

import { PrismaClient, IncidentStatus, Priority } from '@prisma/client';

const prisma = new PrismaClient();

// Thailand coordinates (Bangkok and surrounding areas)
const THAILAND_LOCATIONS = [
  { lat: 13.7563, lng: 100.5018, name: 'Bangkok' },
  { lat: 13.8199, lng: 100.5597, name: 'Don Mueang' },
  { lat: 13.6904, lng: 100.7501, name: 'Samut Prakan' },
  { lat: 13.5990, lng: 100.5998, name: 'Samut Sakhon' },
  { lat: 14.0208, lng: 100.5250, name: 'Pathum Thani' },
  { lat: 13.9544, lng: 100.6116, name: 'Nonthaburi' },
  { lat: 18.7883, lng: 98.9853, name: 'Chiang Mai' },
  { lat: 12.9236, lng: 100.8825, name: 'Pattaya' },
  { lat: 7.8804, lng: 98.3923, name: 'Phuket' },
  { lat: 16.4419, lng: 102.8360, name: 'Khon Kaen' },
];

const INCIDENT_TYPES = [
  'Flood', 'Fire', 'Earthquake', 'Landslide', 'Storm',
  'Accident', 'Building Collapse', 'Gas Leak', 'Power Outage',
];

const DESCRIPTIONS = [
  'Reported by local resident',
  'Emergency situation requiring immediate attention',
  'Multiple casualties reported',
  'Infrastructure damage observed',
  'Evacuation in progress',
  'Rescue team deployed',
  'Medical assistance required',
  'Property damage assessment needed',
];

// Distribution configuration
const DISTRIBUTION = {
  PENDING: { count: 25, priorities: { CRITICAL: 5, HIGH: 10, MEDIUM: 7, LOW: 3 } },
  INVESTIGATING: { count: 40, priorities: { CRITICAL: 8, HIGH: 15, MEDIUM: 12, LOW: 5 } },
  RESOLVED: { count: 30, priorities: { CRITICAL: 3, HIGH: 10, MEDIUM: 12, LOW: 5 } },
  REJECTED: { count: 5, priorities: { CRITICAL: 1, HIGH: 2, MEDIUM: 1, LOW: 1 } },
};

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  console.log('🌱 Seeding test incidents...');

  // Get all users (for assignedTo)
  const fieldOfficers = await prisma.user.findMany({
    where: { role: 'FIELD_OFFICER' },
  });

  if (fieldOfficers.length === 0) {
    console.warn('⚠️  No field officers found. Creating some...');
    // Create dummy field officers if none exist
    for (let i = 1; i <= 5; i++) {
      await prisma.user.create({
        data: {
          email: `officer${i}@guardian.test`,
          username: `officer${i}`,
          password: 'hashed_password', // In real scenario, this should be properly hashed
          fullName: `Officer ${i}`,
          role: 'FIELD_OFFICER',
        },
      });
    }
    // Refresh the list
    const newOfficers = await prisma.user.findMany({
      where: { role: 'FIELD_OFFICER' },
    });
    fieldOfficers.push(...newOfficers);
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  let totalCreated = 0;

  for (const [status, config] of Object.entries(DISTRIBUTION)) {
    for (const [priority, count] of Object.entries(config.priorities)) {
      for (let i = 0; i < count; i++) {
        const location = randomElement(THAILAND_LOCATIONS);
        const createdAt = randomDate(thirtyDaysAgo, now);

        const incidentData: any = {
          title: `${randomElement(INCIDENT_TYPES)} in ${location.name}`,
          description: randomElement(DESCRIPTIONS),
          status: status as IncidentStatus,
          priority: priority as Priority,
          location: {
            type: 'Point',
            coordinates: [
              location.lng + (Math.random() - 0.5) * 0.1,
              location.lat + (Math.random() - 0.5) * 0.1
            ]
          },
          createdAt,
        };

        // Assign to field officer if status is INVESTIGATING or RESOLVED
        if (status === 'INVESTIGATING' || status === 'RESOLVED') {
          incidentData.assignedToId = randomElement(fieldOfficers).id;
        }

        // Set resolvedAt if status is RESOLVED
        if (status === 'RESOLVED') {
          const resolutionTime = Math.random() * 10 * 60 * 60 * 1000; // 0-10 hours
          incidentData.resolvedAt = new Date(createdAt.getTime() + resolutionTime);
        }

        await prisma.incident.create({ data: incidentData });
        totalCreated++;
      }
    }
  }

  console.log(`✅ Successfully created ${totalCreated} test incidents`);
  console.log('\nDistribution:');
  console.log(`  PENDING: ${DISTRIBUTION.PENDING.count}`);
  console.log(`  INVESTIGATING: ${DISTRIBUTION.INVESTIGATING.count}`);
  console.log(`  RESOLVED: ${DISTRIBUTION.RESOLVED.count}`);
  console.log(`  REJECTED: ${DISTRIBUTION.REJECTED.count}`);
  console.log(`  TOTAL: ${totalCreated}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding incidents:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
