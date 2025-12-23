import { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { BaseMap } from './BaseMap';
import { incidentsApi } from '../../api/incidents';
import type { Incident, Priority } from '../../types';
import L from 'leaflet';

// Custom marker colors based on priority
const getMarkerIcon = (priority: Priority) => {
  const colors = {
    LOW: '#6B7280',      // gray
    MEDIUM: '#3B82F6',   // blue
    HIGH: '#F97316',     // orange
    CRITICAL: '#EF4444', // red
  };

  const color = colors[priority];

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    PENDING: 'รอดำเนินการ',
    IN_PROGRESS: 'กำลังดำเนินการ',
    RESOLVED: 'แก้ไขแล้ว',
    CLOSED: 'ปิดงาน',
  };
  return labels[status] || status;
};

const getPriorityLabel = (priority: Priority) => {
  const labels = {
    LOW: 'ต่ำ',
    MEDIUM: 'ปานกลาง',
    HIGH: 'สูง',
    CRITICAL: 'วิกฤต',
  };
  return labels[priority];
};

const getDisasterTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    FLOOD: 'น้ำท่วม',
    LANDSLIDE: 'ดินถล่ม',
    FIRE: 'ไฟไหม้',
    STORM: 'พายุ',
    EARTHQUAKE: 'แผ่นดินไหว',
    OTHER: 'อื่นๆ',
  };
  return labels[type] || type;
};

interface IncidentsMapProps {
  className?: string;
  onIncidentClick?: (incident: Incident) => void;
}

export const IncidentsMap = ({ className, onIncidentClick }: IncidentsMapProps) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      const data = await incidentsApi.getAll({});
      setIncidents(data);
    } catch (error) {
      console.error('Error loading incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <BaseMap className={className}>
      {incidents.map((incident) => {
        if (!incident.location?.coordinates) return null;

        const [lng, lat] = incident.location.coordinates;
        console.log(`Incident ${incident.id}:`, { lat, lng, raw: incident.location.coordinates });

        return (
          <Marker
            key={incident.id}
            position={[lat, lng]}
            icon={getMarkerIcon(incident.priority)}
            eventHandlers={{
              click: () => onIncidentClick?.(incident),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-2">{incident.title}</h3>

                {incident.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {incident.description}
                  </p>
                )}

                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">ประเภท:</span>{' '}
                    {getDisasterTypeLabel(incident.disasterType)}
                  </div>
                  <div>
                    <span className="font-medium">ความสำคัญ:</span>{' '}
                    <span className={`font-medium ${incident.priority === 'CRITICAL' ? 'text-red-600' :
                        incident.priority === 'HIGH' ? 'text-orange-600' :
                          incident.priority === 'MEDIUM' ? 'text-blue-600' :
                            'text-gray-600'
                      }`}>
                      {getPriorityLabel(incident.priority)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">สถานะ:</span>{' '}
                    {getStatusLabel(incident.status)}
                  </div>
                  {incident.village && (
                    <div>
                      <span className="font-medium">หมู่บ้าน:</span>{' '}
                      {incident.village.name}
                    </div>
                  )}
                  {incident.address && (
                    <div>
                      <span className="font-medium">ที่อยู่:</span>{' '}
                      {incident.address}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t text-xs text-gray-500">
                  รายงานโดย: {incident.createdBy.firstName} {incident.createdBy.lastName}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </BaseMap>
  );
};
