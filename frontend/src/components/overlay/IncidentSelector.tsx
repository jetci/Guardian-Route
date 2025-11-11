import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface IncidentFeature extends GeoJSON.Feature<GeoJSON.Polygon> {
  properties: {
    id: string;
    title: string;
    type: string;
    date: string;
  };
}

interface IncidentResponse {
  id: string;
  title: string;
  type: string;
  latitude: number;
  longitude: number;
  radius: number;
  createdAt: string;
}

interface IncidentSelectorProps {
  onSelectionChange: (selected: IncidentFeature[]) => void;
}

const IncidentSelector: React.FC<IncidentSelectorProps> = ({
  onSelectionChange,
}) => {
  const [incidents, setIncidents] = useState<IncidentFeature[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      
      const response = await axios.get<IncidentResponse[]>(
        `${apiUrl}/incidents?from=2025-07-01&to=2025-12-31`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Map to GeoJSON FeatureCollection
      const features: IncidentFeature[] = response.data.map((incident) => {
        // Create polygon from center point and radius
        const radiusInDegrees = incident.radius / 111320; // Convert meters to degrees (approx)
        const center = [incident.longitude, incident.latitude];
        const points = 16; // Number of points in polygon
        const coordinates = [];
        
        for (let i = 0; i <= points; i++) {
          const angle = (i * 360) / points;
          const dx = radiusInDegrees * Math.cos((angle * Math.PI) / 180);
          const dy = radiusInDegrees * Math.sin((angle * Math.PI) / 180);
          coordinates.push([center[0] + dx, center[1] + dy]);
        }
        
        return {
          type: 'Feature',
          properties: {
            id: incident.id,
            title: incident.title,
            type: incident.type,
            date: new Date(incident.createdAt).toLocaleDateString('th-TH'),
          },
          geometry: {
            type: 'Polygon',
            coordinates: [coordinates],
          },
        } as IncidentFeature;
      });
      
      setIncidents(features);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถโหลดข้อมูลได้');
      console.error('Error fetching incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);

    // Notify parent component
    const selectedIncidents = incidents.filter((incident) =>
      newSelected.has(incident.properties.id)
    );
    onSelectionChange(selectedIncidents);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === incidents.length) {
      setSelectedIds(new Set());
      onSelectionChange([]);
    } else {
      const allIds = new Set(incidents.map((i) => i.properties.id));
      setSelectedIds(allIds);
      onSelectionChange(incidents);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      FIRE: 'text-[#ff4d4d]',
      FLOOD: 'text-[#4d79ff]',
      ACCIDENT: 'text-[#ffd633]',
      OTHER: 'text-[#999999]',
    };
    return colors[type] || 'text-[#999999]';
  };

  const getTypeBgColor = (type: string) => {
    const colors: Record<string, string> = {
      FIRE: 'bg-[#ff4d4d]',
      FLOOD: 'bg-[#4d79ff]',
      ACCIDENT: 'bg-[#ffd633]',
      OTHER: 'bg-[#999999]',
    };
    return colors[type] || 'bg-[#999999]';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-red-600 text-sm">{error}</div>
        <button
          onClick={fetchIncidents}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
        >
          ลองใหม่
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          เลือกเหตุการณ์
        </h3>
        <button
          onClick={handleSelectAll}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {selectedIds.size === incidents.length ? 'ยกเลิกทั้งหมด' : 'เลือกทั้งหมด'}
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {incidents.map((incident) => (
          <label
            key={incident.properties.id}
            className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-200"
          >
            <input
              type="checkbox"
              checked={selectedIds.has(incident.properties.id)}
              onChange={() => handleToggle(incident.properties.id)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <div className="ml-3 flex-1">
              <div className="font-medium text-gray-800">
                {incident.properties.title}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-block w-3 h-3 rounded-full ${getTypeBgColor(incident.properties.type)}`}></span>
                <span className={`text-sm ${getTypeColor(incident.properties.type)}`}>
                  {incident.properties.type}
                </span>
                <span className="text-xs text-gray-500">• {incident.properties.date}</span>
              </div>
            </div>
          </label>
        ))}
      </div>

      {selectedIds.size > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            เลือกแล้ว: <span className="font-semibold">{selectedIds.size}</span> รายการ
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentSelector;
