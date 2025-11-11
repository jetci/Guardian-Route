import React, { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { divIcon, type LatLngExpression } from 'leaflet';

// Define a placeholder for the Resource type until it is properly defined
interface Resource {
  id: string;
  name: string;
  type: 'VEHICLE' | 'EQUIPMENT' | 'PERSONNEL' | 'MEDICAL' | 'SHELTER';
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  allocatedTo?: string;
}

interface ResourceMarkerProps {
  resource: Resource;
}

const getIconHtml = (type: Resource['type'], status: Resource['status']) => {
  let iconClass = 'resource-icon';
  let iconText = '';

  switch (type) {
    case 'VEHICLE':
      iconText = '🚗';
      break;
    case 'EQUIPMENT':
      iconText = '🛠️';
      break;
    case 'PERSONNEL':
      iconText = '🧑‍🚒';
      break;
    case 'MEDICAL':
      iconText = '⚕️';
      break;
    case 'SHELTER':
      iconText = '⛺';
      break;
    default:
      iconText = '❓';
  }

  switch (status) {
    case 'AVAILABLE':
      iconClass += ' available';
      break;
    case 'IN_USE':
      iconClass += ' in-use';
      break;
    case 'MAINTENANCE':
      iconClass += ' maintenance';
      break;
  }

  return `<div class="${iconClass}">${iconText}</div>`;
};

const ResourceMarker: React.FC<ResourceMarkerProps> = ({ resource }) => {
  const position: LatLngExpression = useMemo(() => {
    if (resource.location && resource.location.coordinates) {
      // GeoJSON is [lng, lat], Leaflet is [lat, lng]
      return [resource.location.coordinates[1], resource.location.coordinates[0]];
    }
    // Default to a central location if coordinates are missing
    return [13.7563, 100.5018]; 
  }, [resource.location]);

  const customIcon = useMemo(() => {
    return divIcon({
      className: 'custom-marker',
      html: getIconHtml(resource.type, resource.status),
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  }, [resource.type, resource.status]);

  return (
    <Marker position={position} icon={customIcon}>
      <Popup>
        <strong>{resource.name}</strong>
        <br />
        Type: {resource.type}
        <br />
        Status: {resource.status}
        {resource.allocatedTo && <><br />Allocated To: {resource.allocatedTo}</>}
      </Popup>
    </Marker>
  );
};

export default ResourceMarker;
