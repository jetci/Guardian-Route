import { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import { type LatLngExpression, LatLng, DivIcon } from 'leaflet';
import {
  Box,
  Button,
  ButtonGroup,
  useToast,
  Text,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

type DrawMode = 'none' | 'marker' | 'polygon';

interface DrawingMapProps {
  center?: LatLngExpression;
  zoom?: number;
  height?: string;
  onMarkerSet?: (lat: number, lng: number) => void;
  onPolygonComplete?: (coordinates: number[][][]) => void;
  initialMarker?: [number, number];
  initialPolygon?: number[][][];
}

// Drawing Controls Component
function DrawingControls({
  mode,
  onModeChange,
  onClear,
  onComplete,
  polygonPoints,
}: {
  mode: DrawMode;
  onModeChange: (mode: DrawMode) => void;
  onClear: () => void;
  onComplete: () => void;
  polygonPoints: number;
}) {
  return (
    <Box position="absolute" top={4} left={4} zIndex={1000}>
      <VStack spacing={2} align="stretch">
        <ButtonGroup size="sm" isAttached variant="solid">
          <Button
            colorScheme={mode === 'marker' ? 'blue' : 'gray'}
            onClick={() => onModeChange(mode === 'marker' ? 'none' : 'marker')}
          >
            📍 ปักหมุด
          </Button>
          <Button
            colorScheme={mode === 'polygon' ? 'green' : 'gray'}
            onClick={() => onModeChange(mode === 'polygon' ? 'none' : 'polygon')}
          >
            ✏️ วาดพื้นที่
          </Button>
        </ButtonGroup>

        {mode === 'polygon' && polygonPoints > 0 && (
          <VStack spacing={1} bg="white" p={2} borderRadius="md" shadow="md">
            <Badge colorScheme="green">กำลังวาดพื้นที่</Badge>
            <Text fontSize="xs">จุดที่วาด: {polygonPoints}</Text>
            <HStack>
              <Button size="xs" colorScheme="green" onClick={onComplete} isDisabled={polygonPoints < 3}>
                เสร็จสิ้น
              </Button>
              <Button size="xs" colorScheme="red" onClick={onClear}>
                ยกเลิก
              </Button>
            </HStack>
          </VStack>
        )}

        {(mode !== 'none' || polygonPoints > 0) && (
          <Button size="sm" colorScheme="red" variant="outline" onClick={onClear}>
            ล้างทั้งหมด
          </Button>
        )}
      </VStack>
    </Box>
  );
}

// GPS Button Component
function GPSButton({ onLocationFound }: { onLocationFound: (lat: number, lng: number) => void }) {
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
          status: 'success',
          duration: 2000,
        });
        setIsLoading(false);
      },
      (error) => {
        toast({
          title: 'ไม่สามารถระบุตำแหน่งได้',
          description: 'กรุณาเปิดใช้งาน GPS',
          status: 'error',
          duration: 3000,
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
        size="sm"
        colorScheme="blue"
        onClick={handleGetLocation}
        isLoading={isLoading}
      >
        📍 GPS
      </Button>
    </Box>
  );
}

// Map Event Handler
function MapEventHandler({
  mode,
  onMapClick,
}: {
  mode: DrawMode;
  onMapClick: (latlng: LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      if (mode !== 'none') {
        onMapClick(e.latlng);
      }
    },
  });

  return null;
}

export const DrawingMap = ({
  center = [19.9167, 99.2333] as LatLngExpression,
  zoom = 13,
  height = '600px',
  onMarkerSet,
  onPolygonComplete,
  initialMarker,
  initialPolygon,
}: DrawingMapProps) => {
  const [mode, setMode] = useState<DrawMode>('none');
  const [marker, setMarker] = useState<[number, number] | null>(initialMarker || null);
  const [polygonPoints, setPolygonPoints] = useState<[number, number][]>(
    initialPolygon ? initialPolygon[0].map((p) => [p[1], p[0]] as [number, number]) : [],
  );
  const [currentGPS, setCurrentGPS] = useState<[number, number] | null>(null);
  const toast = useToast();

  const handleMapClick = (latlng: LatLng) => {
    if (mode === 'marker') {
      const newMarker: [number, number] = [latlng.lat, latlng.lng];
      setMarker(newMarker);
      if (onMarkerSet) {
        onMarkerSet(latlng.lat, latlng.lng);
      }
      toast({
        title: 'ปักหมุดสำเร็จ',
        description: `Lat: ${latlng.lat.toFixed(6)}, Lng: ${latlng.lng.toFixed(6)}`,
        status: 'success',
        duration: 2000,
      });
      setMode('none');
    } else if (mode === 'polygon') {
      setPolygonPoints([...polygonPoints, [latlng.lat, latlng.lng]]);
    }
  };

  const handleModeChange = (newMode: DrawMode) => {
    setMode(newMode);
    if (newMode === 'marker') {
      toast({
        title: 'โหมดปักหมุด',
        description: 'คลิกบนแผนที่เพื่อปักหมุด',
        status: 'info',
        duration: 2000,
      });
    } else if (newMode === 'polygon') {
      toast({
        title: 'โหมดวาดพื้นที่',
        description: 'คลิกบนแผนที่เพื่อวาดรูปหลายเหลี่ยม',
        status: 'info',
        duration: 2000,
      });
    }
  };

  const handleClear = () => {
    setMarker(null);
    setPolygonPoints([]);
    setMode('none');
    toast({
      title: 'ล้างข้อมูลแล้ว',
      status: 'info',
      duration: 2000,
    });
  };

  const handleCompletePolygon = () => {
    if (polygonPoints.length < 3) {
      toast({
        title: 'จุดไม่เพียงพอ',
        description: 'ต้องมีอย่างน้อย 3 จุดเพื่อสร้างพื้นที่',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    // Close the polygon by adding first point at the end
    const closedPolygon = [...polygonPoints, polygonPoints[0]];

    // Convert to GeoJSON format [lng, lat]
    const geoJsonCoordinates = [closedPolygon.map((p) => [p[1], p[0]])];

    if (onPolygonComplete) {
      onPolygonComplete(geoJsonCoordinates);
    }

    toast({
      title: 'วาดพื้นที่สำเร็จ',
      description: `จำนวนจุด: ${polygonPoints.length}`,
      status: 'success',
      duration: 3000,
    });

    setMode('none');
  };

  const handleGPSFound = (lat: number, lng: number) => {
    setCurrentGPS([lat, lng]);
  };

  // Current GPS Marker Icon
  const gpsIcon = new DivIcon({
    className: 'gps-marker',
    html: `
      <div style="
        width: 16px;
        height: 16px;
        background: #3182ce;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(49, 130, 206, 0.5);
      "></div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  return (
    <Box position="relative" height={height} width="100%">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapEventHandler mode={mode} onMapClick={handleMapClick} />

        <DrawingControls
          mode={mode}
          onModeChange={handleModeChange}
          onClear={handleClear}
          onComplete={handleCompletePolygon}
          polygonPoints={polygonPoints.length}
        />

        <GPSButton onLocationFound={handleGPSFound} />

        {/* User Marker */}
        {marker && (
          <Marker position={marker}>
            <Popup>
              <VStack spacing={1} align="start">
                <Text fontWeight="bold">ตำแหน่งที่เลือก</Text>
                <Text fontSize="sm">Lat: {marker[0].toFixed(6)}</Text>
                <Text fontSize="sm">Lng: {marker[1].toFixed(6)}</Text>
              </VStack>
            </Popup>
          </Marker>
        )}

        {/* GPS Marker */}
        {currentGPS && (
          <Marker position={currentGPS} icon={gpsIcon}>
            <Popup>
              <Text fontSize="sm" fontWeight="bold">
                ตำแหน่ง GPS ปัจจุบัน
              </Text>
            </Popup>
          </Marker>
        )}

        {/* Polygon */}
        {polygonPoints.length > 0 && (
          <Polygon
            positions={polygonPoints}
            pathOptions={{
              color: '#48bb78',
              fillColor: '#48bb78',
              fillOpacity: 0.3,
              weight: 3,
            }}
          >
            <Popup>
              <VStack spacing={1} align="start">
                <Text fontWeight="bold">พื้นที่ที่วาด</Text>
                <Text fontSize="sm">จำนวนจุด: {polygonPoints.length}</Text>
              </VStack>
            </Popup>
          </Polygon>
        )}

        {/* Polygon Points Markers */}
        {mode === 'polygon' &&
          polygonPoints.map((point, index) => (
            <Marker key={index} position={point}>
              <Popup>
                <Text fontSize="sm">จุดที่ {index + 1}</Text>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </Box>
  );
};
