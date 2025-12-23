/**
 * Survey Form Content Component
 * Extracted from SurveyAreaPage to allow reuse without DashboardLayout
 * Can be used in both standalone page and testing mode
 */

import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';
import { TAMBON_INFO } from '../../data/villages';
import { villagesApi, type LeafletVillage } from '../../api/villages';

export function SurveyFormContent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const gpsMarkerRef = useRef<L.Marker | null>(null);
  const villageBoundariesRef = useRef<Map<number, L.GeoJSON>>(new Map());

  const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [drawnArea, setDrawnArea] = useState<any>(null);
  const [areaSize, setAreaSize] = useState<number | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [villages, setVillages] = useState<LeafletVillage[]>([]);
  const [selectedVillage, setSelectedVillage] = useState<LeafletVillage | null>(null);
  const [formData, setFormData] = useState({
    disasterType: '',
    severity: '',
    village: '',
    description: '',
    estimatedHouseholds: ''
  });

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map centered on ตำบลเวียง อำเภอฝาง
    const map = L.map(mapRef.current).setView([TAMBON_INFO.centerLat, TAMBON_INFO.centerLng], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    // Initialize FeatureGroup for drawn items
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    drawnItemsRef.current = drawnItems;

    // Add Geoman controls
    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: true,
      drawPolygon: true,
      drawMarker: false,
      editMode: true,
      dragMode: false,
      cutPolygon: false,
      removalMode: true,
    });

    // Listen to draw events
    map.on('pm:create', (e: any) => {
      const layer = e.layer;
      drawnItems.addLayer(layer);

      // Calculate area
      if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
        const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        const areaInRai = area / 1600; // Convert to rai (1 rai = 1600 m²)
        setAreaSize(areaInRai);
        setDrawnArea(layer.toGeoJSON());
        toast.success(`วาดพื้นที่สำเร็จ: ${areaInRai.toFixed(2)} ไร่`);
      }
    });

    // Listen to edit events
    map.on('pm:edit', (e: any) => {
      const layers = drawnItems.getLayers();
      if (layers.length > 0) {
        const layer = layers[0] as L.Polygon;
        const latLngs = layer.getLatLngs()[0] as L.LatLng[];
        const area = L.GeometryUtil.geodesicArea(latLngs);
        const areaInRai = area / 1600;
        setAreaSize(areaInRai);
        setDrawnArea(layer.toGeoJSON());
      }
    });

    // Listen to remove events
    map.on('pm:remove', () => {
      setDrawnArea(null);
      setAreaSize(null);
      toast('ลบพื้นที่ที่วาดแล้ว', { icon: 'ℹ️' });
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Fetch villages
  useEffect(() => {
    const fetchVillages = async () => {
      try {
        const data = await villagesApi.getAllForMap();
        setVillages(data);
        displayVillageBoundaries(data);
      } catch (error) {
        console.error('Failed to fetch villages:', error);
        toast.error('ไม่สามารถโหลดข้อมูลหมู่บ้านได้');
      }
    };

    fetchVillages();
  }, []);

  // Display village boundaries on map
  const displayVillageBoundaries = (villagesData: LeafletVillage[]) => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Clear existing boundaries
    villageBoundariesRef.current.forEach(layer => {
      map.removeLayer(layer);
    });
    villageBoundariesRef.current.clear();

    // Add new boundaries
    villagesData.forEach(village => {
      if (village.boundary) {
        const geoJsonLayer = L.geoJSON(village.boundary, {
          style: {
            color: village.color || '#3b82f6',
            weight: 2,
            opacity: 0.6,
            fillOpacity: 0.1
          },
          onEachFeature: (feature, layer) => {
            layer.bindPopup(`
              <div style="font-family: sans-serif;">
                <h3 style="margin: 0 0 8px 0; color: #1e40af;">หมู่ ${village.moo}</h3>
                <p style="margin: 0; color: #64748b;">${village.name}</p>
              </div>
            `);
          }
        }).addTo(map);

        villageBoundariesRef.current.set(village.moo, geoJsonLayer);
      }
    });
  };

  // Reset highlight
  const resetHighlight = () => {
    villageBoundariesRef.current.forEach(layer => {
      layer.setStyle({
        weight: 2,
        opacity: 0.6,
        fillOpacity: 0.1
      });
    });
  };

  // Handle village selection
  const handleVillageSelect = (villageId: string) => {
    if (!villageId) {
      setSelectedVillage(null);
      resetHighlight();
      return;
    }

    const village = villages.find(v => v.id === villageId);
    if (!village) return;

    setSelectedVillage(village);
    setFormData(prev => ({ ...prev, village: villageId }));

    // Highlight selected village
    resetHighlight();
    const layer = villageBoundariesRef.current.get(village.moo);
    if (layer) {
      layer.setStyle({
        weight: 3,
        opacity: 1,
        fillOpacity: 0.3,
        color: village.color || '#3b82f6'
      });

      // Zoom to village
      zoomToVillage(village);
    }
  };

  // Zoom to village
  const zoomToVillage = (village: LeafletVillage) => {
    if (!mapInstanceRef.current) return;

    const layer = villageBoundariesRef.current.get(village.moo);
    if (layer) {
      const bounds = layer.getBounds();
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  // Get current location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('เบราว์เซอร์ไม่รองรับ GPS');
      return;
    }

    toast.loading('กำลังค้นหาตำแหน่ง...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });

        // Add or update GPS marker
        if (mapInstanceRef.current) {
          if (gpsMarkerRef.current) {
            mapInstanceRef.current.removeLayer(gpsMarkerRef.current);
          }

          const marker = L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })
          }).addTo(mapInstanceRef.current);

          marker.bindPopup('📍 ตำแหน่งปัจจุบันของคุณ').openPopup();
          gpsMarkerRef.current = marker;

          mapInstanceRef.current.setView([latitude, longitude], 15);
        }

        toast.dismiss();
        toast.success(`ระบุตำแหน่งสำเร็จ: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      },
      (error) => {
        toast.dismiss();
        toast.error('ไม่สามารถระบุตำแหน่งได้: ' + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Handle form submission
  const handleSubmit = () => {

    if (!currentLocation) {
      toast.error('กรุณาระบุตำแหน่ง GPS ก่อน');
      return;
    }

    if (!drawnArea) {
      toast.error('กรุณาวาดขอบเขตพื้นที่บนแผนที่');
      return;
    }

    if (!formData.disasterType || !formData.severity || !formData.village) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    // Log data (TODO: Send to API)
    const surveyData = {
      location: currentLocation,
      area: drawnArea,
      areaSize: areaSize,
      ...formData,
      images: selectedImages,
      timestamp: new Date().toISOString()
    };

    console.log('Survey Data:', surveyData);
    toast.success('บันทึกข้อมูลสำเร็จ!');
  };

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > 5) {
      toast.error('สามารถอัพโหลดได้สูงสุด 5 รูป');
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a202c', margin: '0 0 8px 0' }}>
          🔍 สำรวจพื้นที่ (Survey Area)
        </h1>
        <p style={{ color: '#718096', margin: 0 }}>
          ระบุตำแหน่ง GPS และวาดขอบเขตพื้นที่ประสบภัย
        </p>
      </div>

      {/* Map Section */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>🗺️ แผนที่สำรวจ</h2>
          <button
            onClick={handleGetLocation}
            style={{
              padding: '10px 20px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
            }}
          >
            📍 Get Location
          </button>
        </div>

        {/* Village Selector */}
        <div style={{ marginBottom: '16px', padding: '16px', background: '#f0f9ff', borderRadius: '8px', border: '2px solid #bfdbfe' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#1e40af' }}>
            🏘️ เลือกหมู่บ้าน *
          </label>
          <select
            value={selectedVillage?.id || ''}
            onChange={(e) => handleVillageSelect(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #3b82f6',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            <option value="">-- เลือกหมู่บ้าน --</option>
            {villages.map(village => (
              <option key={village.id} value={village.id}>
                หมู่ {village.moo} - {village.name}
              </option>
            ))}
          </select>
        </div>

        {/* Map Container */}
        <div
          ref={mapRef}
          style={{
            height: '500px',
            borderRadius: '12px',
            border: '2px solid #e2e8f0',
            overflow: 'hidden'
          }}
        />

        {/* Current Location & Area Info */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {currentLocation && (
            <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '2px solid #86efac' }}>
              <div style={{ fontSize: '12px', color: '#15803d', fontWeight: '600', marginBottom: '4px' }}>📍 ตำแหน่ง GPS</div>
              <div style={{ fontSize: '14px', color: '#166534' }}>
                {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
              </div>
            </div>
          )}
          {areaSize !== null && (
            <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '8px', border: '2px solid #93c5fd' }}>
              <div style={{ fontSize: '12px', color: '#1e40af', fontWeight: '600', marginBottom: '4px' }}>📐 ขนาดพื้นที่</div>
              <div style={{ fontSize: '14px', color: '#1e3a8a' }}>
                {areaSize.toFixed(2)} ไร่ ({(areaSize * 1600).toFixed(0)} ตร.ม.)
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div style={{ marginTop: '16px', padding: '12px', background: '#fef3c7', borderRadius: '8px', border: '2px solid #fcd34d' }}>
          <div style={{ fontSize: '14px', color: '#92400e', fontWeight: '600', marginBottom: '8px' }}>💡 วิธีใช้:</div>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#92400e', fontSize: '13px' }}>
            <li>คลิก "Get Location" เพื่อระบุตำแหน่งปัจจุบัน</li>
            <li>เลือกหมู่บ้านจาก dropdown เพื่อดูขอบเขต</li>
            <li>ใช้เครื่องมือวาด (สี่เหลี่ยม/รูปหลายเหลี่ยม) เพื่อระบุพื้นที่ประสบภัย</li>
            <li>กรอกข้อมูลเพิ่มเติมด้านล่าง แล้วคลิก "บันทึกข้อมูลสำรวจ"</li>
          </ul>
        </div>
      </div>

      {/* Form Section */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>📝 ข้อมูลเพิ่มเติม</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
              ประเภทภัย *
            </label>
            <select
              value={formData.disasterType}
              onChange={(e) => setFormData(prev => ({ ...prev, disasterType: e.target.value }))}
              style={{ width: '100%', padding: '10px', border: '2px solid #e2e8f0', borderRadius: '8px' }}
            >
              <option value="">-- เลือกประเภทภัย --</option>
              <option value="flood">น้ำท่วม</option>
              <option value="landslide">ดินถล่ม</option>
              <option value="fire">ไฟไหม้</option>
              <option value="storm">พายุ</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
              ระดับความรุนแรง *
            </label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value }))}
              style={{ width: '100%', padding: '10px', border: '2px solid #e2e8f0', borderRadius: '8px' }}
            >
              <option value="">-- เลือกระดับ --</option>
              <option value="low">เล็กน้อย</option>
              <option value="medium">ปานกลาง</option>
              <option value="high">รุนแรง</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
            รายละเอียดเพิ่มเติม
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            placeholder="อธิบายสถานการณ์และความเสียหาย..."
            style={{ width: '100%', padding: '10px', border: '2px solid #e2e8f0', borderRadius: '8px', resize: 'vertical' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
            จำนวนครัวเรือนที่ได้รับผลกระทบ (โดยประมาณ)
          </label>
          <input
            type="number"
            value={formData.estimatedHouseholds}
            onChange={(e) => setFormData(prev => ({ ...prev, estimatedHouseholds: e.target.value }))}
            placeholder="เช่น 50"
            style={{ width: '100%', padding: '10px', border: '2px solid #e2e8f0', borderRadius: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
            อัพโหลดรูปภาพ (สูงสุด 5 รูป)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            style={{ display: 'block', marginBottom: '8px' }}
          />
          {imagePreviews.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginTop: '12px' }}>
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #e2e8f0' }}
                />
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '14px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}
        >
          📤 บันทึกข้อมูลสำรวจ
        </button>
      </div>
    </div>
  );
}

export default SurveyFormContent;
