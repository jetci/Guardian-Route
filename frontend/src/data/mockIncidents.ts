/**
 * Mock Incidents Data
 * สร้างข้อมูล incidents จากหมู่บ้านจริง 20 หมู่
 */

import { VILLAGES, TAMBON_INFO } from './villages';

export interface Incident {
  id: number;
  title: string;
  location: string;
  type: 'FLOOD' | 'LANDSLIDE' | 'FIRE' | 'STORM' | 'EARTHQUAKE';
  severity: 1 | 2 | 3 | 4 | 5;
  lat: number;
  lng: number;
  date: string;
  status: 'ACTIVE' | 'RESOLVED';
}

const DISASTER_TYPES: Array<{type: Incident['type'], label: string}> = [
  { type: 'FLOOD', label: 'น้ำท่วม' },
  { type: 'LANDSLIDE', label: 'ดินถล่ม' },
  { type: 'FIRE', label: 'อัคคีภัย' },
  { type: 'STORM', label: 'วาตภัย' },
  { type: 'EARTHQUAKE', label: 'แผ่นดินไหว' },
];

/**
 * สร้าง mock incidents จากหมู่บ้านทั้ง 20 หมู่
 */
export const MOCK_INCIDENTS: Incident[] = VILLAGES.map((village, index) => {
  const disasterType = DISASTER_TYPES[index % DISASTER_TYPES.length];
  const severity = (((index % 5) + 1) as Incident['severity']);
  const daysAgo = index;
  const status: Incident['status'] = index % 3 === 0 ? 'RESOLVED' : 'ACTIVE';
  
  return {
    id: village.id,
    title: `${disasterType.label} - บ้าน${village.name}`,
    location: `บ้าน${village.name} หมู่ ${village.moo} ${TAMBON_INFO.fullName}`,
    type: disasterType.type,
    severity,
    lat: village.lat,
    lng: village.lng,
    date: new Date(Date.now() - daysAgo * 86400000).toISOString().split('T')[0],
    status,
  };
});

/**
 * ดึง incidents ตาม type
 */
export function getIncidentsByType(type: Incident['type']): Incident[] {
  return MOCK_INCIDENTS.filter(i => i.type === type);
}

/**
 * ดึง incidents ตาม status
 */
export function getIncidentsByStatus(status: Incident['status']): Incident[] {
  return MOCK_INCIDENTS.filter(i => i.status === status);
}

/**
 * ดึง incidents ตาม severity
 */
export function getIncidentsBySeverity(severity: number): Incident[] {
  return MOCK_INCIDENTS.filter(i => i.severity === severity);
}

/**
 * ดึง active incidents
 */
export function getActiveIncidents(): Incident[] {
  return MOCK_INCIDENTS.filter(i => i.status === 'ACTIVE');
}

/**
 * ดึง resolved incidents
 */
export function getResolvedIncidents(): Incident[] {
  return MOCK_INCIDENTS.filter(i => i.status === 'RESOLVED');
}
