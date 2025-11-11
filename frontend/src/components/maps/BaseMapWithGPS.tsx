import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression, DivIcon } from 'leaflet';
import { Box, Button, useToast, Text, VStack } from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { mapConfig } from '../../config/mapConfig';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// GPS Location Button Component
function GPSLocationButton({
  onLocationFound,
}: {
  onLocationFound: (lat: number, lng: number) => void;
}) {
  const map = useMap();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'ไม่รองรับ GPS',
        description: 'เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 16);
        onLocationFound(latitude, longitude);

        toast({
          title: 'พบตำแหน่งของคุณ',
          description: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
          status: 'success',
          duration: 3000,
        });
        setIsLoading(false);
      },
      (error) => {
        console.error('GPS Error:', error);
        toast({
          title: 'ไม่สามารถระบุตำแหน่งได้',
          description: 'กรุณาเปิดใช้งาน GPS และอนุญาตการเข้าถึงตำแหน่ง',
          status: 'error',
          duration: 5000,
        });
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  return (
    <Box position="absolute" top={4} right={4} zIndex={1000}>
      <Button
        colorScheme="blue"
        size="sm"
        onClick={handleGetLocation}
        isLoading={isLoading}
        loadingText="กำลังค้นหา..."
      >
        📍 ตำแหน่งของฉัน
      </Button>
    </Box>
  );
}

// Current Location Marker
function CurrentLocationMarker({ position }: { position: [number, number] | null }) {
  if (!position) return null;

  const currentLocationIcon = new DivIcon({
    className: 'current-location-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: #3182ce;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(49, 130, 206, 0.5);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  return (
    <Marker position={position} icon={currentLocationIcon}>
      <Popup>
        <VStack spacing={1} align="start">
          <Text fontWeight="bold">ตำแหน่งปัจจุบันของคุณ</Text>
          <Text fontSize="sm">Lat: {position[0].toFixed(6)}</Text>
          <Text fontSize="sm">Lng: {position[1].toFixed(6)}</Text>
        </VStack>
      </Popup>
    </Marker>
  );
}

interface BaseMapWithGPSProps {
  center?: LatLngExpression;
  zoom?: number;
  height?: string;
  children?: React.ReactNode;
  onLocationFound?: (lat: number, lng: number) => void;
  showGPSButton?: boolean;
}

export const BaseMapWithGPS = ({
  center = [19.9263, 99.8832] as LatLngExpression, // ตำบลเวียง
  zoom = 13,
  height = '500px',
  children,
  onLocationFound,
  showGPSButton = true,
}: BaseMapWithGPSProps) => {
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);

  const handleLocationFound = (lat: number, lng: number) => {
    setCurrentPosition([lat, lng]);
    if (onLocationFound) {
      onLocationFound(lat, lng);
    }
  };

  return (
    <Box position="relative" height={height} width="100%">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {showGPSButton && <GPSLocationButton onLocationFound={handleLocationFound} />}

        <CurrentLocationMarker position={currentPosition} />

        {children}
      </MapContainer>
    </Box>
  );
};
