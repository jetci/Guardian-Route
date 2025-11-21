/**
 * Survey Area Page - Field Officer
 * สำรวจพื้นที่พร้อม GPS และ Drawing Tools
 */

import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';
import { VILLAGE_NAMES, TAMBON_INFO } from '../../data/villages';
import { fetchVillages, type Village } from '../../services/villageService';

const VILLAGES = VILLAGE_NAMES;

export default function SurveyAreaPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const gpsMarkerRef = useRef<L.Marker | null>(null);
  const villageBoundariesRef = useRef<Map<number, L.GeoJSON>>(new Map());
  
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [drawnArea, setDrawnArea] = useState<any>(null);
  const [areaSize, setAreaSize] = useState<number | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
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

    // Add FeatureGroup for drawn items
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
      drawMarker: true,
      editMode: true,
      dragMode: true,
      cutPolygon: false,
      removalMode: true,
    });

    // Set Geoman to work with our feature group
    map.pm.setGlobalOptions({
      layerGroup: drawnItems,
    });

    // Listen for drawn shapes
    map.on('pm:create', (e: any) => {
      const layer = e.layer;
      if (layer && typeof layer.toGeoJSON === 'function') {
        const geojson = layer.toGeoJSON();
        setDrawnArea(geojson);
        
        // Calculate area for Polygon/Rectangle
        if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
          const latlngs = layer.getLatLngs()[0] as L.LatLng[];
          let area = 0;
          
          // Simple area calculation using Shoelace formula
          for (let i = 0; i < latlngs.length; i++) {
            const j = (i + 1) % latlngs.length;
            area += latlngs[i].lat * latlngs[j].lng;
            area -= latlngs[j].lat * latlngs[i].lng;
          }
          area = Math.abs(area / 2);
          
          // Convert to km² (rough approximation)
          const areaKm2 = area * 111 * 111 * Math.cos(latlngs[0].lat * Math.PI / 180);
          setAreaSize(parseFloat(areaKm2.toFixed(4)));
          
          toast.success(`✅ วาดขอบเขตพื้นที่เรียบร้อย (${areaKm2.toFixed(4)} ตร.กม.)`);
        } else {
          toast.success('✅ วาดขอบเขตพื้นที่เรียบร้อย');
        }
      }
    });

    map.on('pm:remove', () => {
      setDrawnArea(null);
      setAreaSize(null);
      toast('ลบขอบเขตพื้นที่แล้ว', { icon: 'ℹ️' });
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Fetch villages and display boundaries
  useEffect(() => {
    const loadVillages = async () => {
      try {
        const villagesData = await fetchVillages();
        setVillages(villagesData);
        console.log('✅ Loaded villages from API:', villagesData.length);
        
        // Display boundaries on map after a short delay
        setTimeout(() => {
          displayVillageBoundaries(villagesData);
        }, 500);
      } catch (error) {
        console.error('Error loading villages from API:', error);
        
        // Fallback to mock data
        console.log('⚠️ Using mock village data');
        const mockVillages: Village[] = [
          { id: 1, name: 'บ้านทุ่งยาว', moo: 1, lat: 19.9200, lng: 99.2150, households: 150, boundary: undefined },
          { id: 2, name: 'บ้านสันต้นดู่', moo: 2, lat: 19.9250, lng: 99.2200, households: 120, boundary: undefined },
          { id: 3, name: 'บ้านป่าไผ่', moo: 3, lat: 19.9150, lng: 99.2100, households: 100, boundary: undefined },
          { id: 4, name: 'บ้านสันกลาง', moo: 4, lat: 19.9300, lng: 99.2250, households: 130, boundary: undefined },
          { id: 5, name: 'บ้านห้วยไคร้', moo: 5, lat: 19.9100, lng: 99.2050, households: 90, boundary: undefined },
        ];
        setVillages(mockVillages);
        toast('⚠️ ใช้ข้อมูลหมู่บ้านชั่วคราว', { icon: 'ℹ️', duration: 3000 });
      }
    };
    
    loadVillages();
  }, []);

  // Display village boundaries on map
  const displayVillageBoundaries = (villagesData: Village[]) => {
    if (!mapInstanceRef.current) return;
    
    const map = mapInstanceRef.current;
    
    villagesData.forEach(village => {
      if (village.boundary && village.boundary.length > 0) {
        // Create GeoJSON layer
        const geoJsonLayer = L.geoJSON({
          type: 'Feature',
          properties: {
            villageId: village.id,
            villageName: village.name,
            villageNo: village.moo
          },
          geometry: {
            type: 'Polygon',
            coordinates: [village.boundary.map(coord => [coord[1], coord[0]])] // [lat, lng] -> [lng, lat]
          }
        }, {
          style: {
            color: '#3388ff',
            weight: 2,
            opacity: 0.6,
            fillOpacity: 0.1
          }
        });
        
        // Bind popup
        geoJsonLayer.bindPopup(`
          <div style="text-align: center;">
            <strong style="font-size: 16px;">หมู่ ${village.moo}</strong><br/>
            <span style="font-size: 14px;">${village.name}</span><br/>
            <span style="font-size: 12px; color: #666;">👥 ${village.households || 0} ครัวเรือน</span>
          </div>
        `);
        
        // Bind tooltip
        geoJsonLayer.bindTooltip(`หมู่ ${village.moo}`, {
          permanent: false,
          direction: 'center',
          className: 'village-tooltip'
        });
        
        // Click event
        geoJsonLayer.on('click', () => {
          handleVillageClick(village);
        });
        
        geoJsonLayer.addTo(map);
        villageBoundariesRef.current.set(village.moo, geoJsonLayer);
      }
    });
    
    console.log('✅ Displayed', villageBoundariesRef.current.size, 'village boundaries');
  };

  // Handle village selection from dropdown
  const handleVillageSelect = (villageId: string) => {
    if (!villageId) {
      setSelectedVillage(null);
      resetHighlight();
      return;
    }
    
    const village = villages.find(v => v.id === parseInt(villageId));
    if (village) {
      setSelectedVillage(village);
      setFormData({...formData, village: village.name});
      highlightVillage(village);
      zoomToVillage(village);
      toast.success(`เลือกหมู่ ${village.moo} - ${village.name}`);
    }
  };

  // Handle village click from map
  const handleVillageClick = (village: Village) => {
    setSelectedVillage(village);
    setFormData({...formData, village: village.name});
    highlightVillage(village);
    zoomToVillage(village);
    toast.success(`เลือกหมู่ ${village.moo} - ${village.name}`);
  };

  // Highlight selected village
  const highlightVillage = (village: Village) => {
    // Reset all styles
    resetHighlight();
    
    // Highlight selected village
    const layer = villageBoundariesRef.current.get(village.moo);
    if (layer) {
      layer.setStyle({
        color: '#ff6b6b',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.3
      });
      layer.bringToFront();
    }
  };

  // Reset highlight
  const resetHighlight = () => {
    villageBoundariesRef.current.forEach(layer => {
      layer.setStyle({
        color: '#3388ff',
        weight: 2,
        opacity: 0.6,
        fillOpacity: 0.1
      });
    });
  };

  // Zoom to village
  const zoomToVillage = (village: Village) => {
    if (!mapInstanceRef.current) return;
    
    const layer = villageBoundariesRef.current.get(village.moo);
    if (layer) {
      const bounds = layer.getBounds();
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else if (village.lat && village.lng) {
      // Fallback to center point
      mapInstanceRef.current.setView([village.lat, village.lng], 15);
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
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15);
          
          // Remove old GPS marker if exists
          if (gpsMarkerRef.current) {
            mapInstanceRef.current.removeLayer(gpsMarkerRef.current);
          }
          
          // Add new marker
          const newMarker = L.marker([latitude, longitude], {
            icon: L.divIcon({
              className: 'custom-marker',
              html: '<div style="background: #3b82f6; color: white; padding: 8px 12px; border-radius: 20px; font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">📍 ตำแหน่งปัจจุบัน</div>',
              iconSize: [150, 40],
              iconAnchor: [75, 40]
            })
          }).addTo(mapInstanceRef.current);
          
          gpsMarkerRef.current = newMarker;
        }
        
        toast.dismiss();
        toast.success(`📍 พบตำแหน่ง: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      },
      (error) => {
        toast.dismiss();
        toast.error('ไม่สามารถค้นหาตำแหน่งได้: ' + error.message);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    console.log('Survey Data:', {
      location: currentLocation,
      area: drawnArea,
      areaSize: areaSize,
      images: selectedImages,
      ...formData
    });
    
    toast.success('✅ บันทึกข้อมูลการสำรวจเรียบร้อย');
    
    // Reset form
    setFormData({
      disasterType: '',
      severity: '',
      village: '',
      description: '',
      estimatedHouseholds: ''
    });
    setDrawnArea(null);
    setAreaSize(null);
    setCurrentLocation(null);
    setSelectedImages([]);
    setImagePreviews([]);
    
    // Clear map layers
    if (drawnItemsRef.current) {
      drawnItemsRef.current.clearLayers();
    }
    
    // Remove GPS marker
    if (gpsMarkerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(gpsMarkerRef.current);
      gpsMarkerRef.current = null;
    }
  };

  return (
    <DashboardLayout>
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
                background: 'white'
              }}
              required
            >
              <option value="">-- เลือกหมู่บ้าน หรือคลิกบนแผนที่ --</option>
              {villages.map(v => (
                <option key={v.id} value={v.id}>
                  หมู่ {v.moo} - {v.name} {v.households ? `(${v.households} ครัวเรือน)` : ''}
                </option>
              ))}
            </select>
            {selectedVillage && (
              <div style={{ marginTop: '12px', padding: '10px', background: 'white', borderRadius: '6px', fontSize: '13px' }}>
                <strong style={{ color: '#1e40af' }}>✅ เลือกแล้ว:</strong> หมู่ {selectedVillage.moo} - {selectedVillage.name}
              </div>
            )}
          </div>
          
          {currentLocation && (
            <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px', marginBottom: '16px', border: '1px solid #86efac' }}>
              <strong style={{ color: '#16a34a' }}>✅ ตำแหน่งปัจจุบัน:</strong>
              <span style={{ marginLeft: '8px', color: '#166534' }}>
                Lat: {currentLocation.lat.toFixed(6)}, Lng: {currentLocation.lng.toFixed(6)}
              </span>
            </div>
          )}
          
          {areaSize && (
            <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '8px', marginBottom: '16px', border: '1px solid #93c5fd' }}>
              <strong style={{ color: '#1e40af' }}>📏 พื้นที่ที่วาด:</strong>
              <span style={{ marginLeft: '8px', color: '#1e3a8a', fontSize: '16px', fontWeight: '600' }}>
                {areaSize} ตร.กม.
              </span>
            </div>
          )}
          
          <div
            ref={mapRef}
            style={{
              height: '500px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #e2e8f0'
            }}
          />
          
          <div style={{ marginTop: '12px', padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
            <strong style={{ fontSize: '14px' }}>💡 วิธีใช้:</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '14px', color: '#4a5568' }}>
              <li>คลิก "Get Location" เพื่อระบุตำแหน่งปัจจุบัน</li>
              <li>ใช้เครื่องมือด้านซ้ายบนแผนที่เพื่อวาด Polygon หรือ Rectangle</li>
              <li>สามารถแก้ไข ลบ หรือย้ายรูปร่างได้</li>
            </ul>
          </div>
        </div>

        {/* Form Section */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>📝 บันทึกข้อมูลการสำรวจ</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>ประเภทภัย *</label>
                <select
                  value={formData.disasterType}
                  onChange={(e) => setFormData({...formData, disasterType: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                  required
                >
                  <option value="">เลือกประเภทภัย</option>
                  <option value="flood">น้ำท่วม</option>
                  <option value="landslide">ดินถล่ม</option>
                  <option value="fire">อัคคีภัย</option>
                  <option value="earthquake">แผ่นดินไหว</option>
                  <option value="storm">วาตภัย</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>ระดับความรุนแรง *</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({...formData, severity: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                  required
                >
                  <option value="">เลือกระดับ</option>
                  <option value="1">1 - เล็กน้อย</option>
                  <option value="2">2 - ปานกลาง</option>
                  <option value="3">3 - รุนแรง</option>
                  <option value="4">4 - รุนแรงมาก</option>
                  <option value="5">5 - ภัยพิบัติ</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>จำนวนครัวเรือนประมาณ</label>
                <input
                  type="number"
                  value={formData.estimatedHouseholds}
                  onChange={(e) => setFormData({...formData, estimatedHouseholds: e.target.value})}
                  placeholder="เช่น 50"
                  style={{ width: '100%', padding: '10px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>รายละเอียดเพิ่มเติม</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                placeholder="บันทึกรายละเอียดการสำรวจ สภาพพื้นที่ ความเสียหาย..."
                style={{ width: '100%', padding: '10px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>อัปโหลดรูปภาพ</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setSelectedImages(files);
                  
                  // Create previews
                  const previews = files.map(file => URL.createObjectURL(file));
                  setImagePreviews(previews);
                  
                  if (files.length > 0) {
                    toast.success(`✅ เลือก ${files.length} รูปภาพ`);
                  }
                }}
                style={{ width: '100%', padding: '10px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
              />
              
              {imagePreviews.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <strong style={{ fontSize: '14px', color: '#4a5568', marginBottom: '8px', display: 'block' }}>
                    📸 ภาพที่เลือก ({imagePreviews.length} รูป)
                  </strong>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                    {imagePreviews.map((preview, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img 
                          src={preview} 
                          alt={`Preview ${i+1}`} 
                          style={{ 
                            width: '100%', 
                            height: '150px', 
                            objectFit: 'cover', 
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0'
                          }} 
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = selectedImages.filter((_, idx) => idx !== i);
                            const newPreviews = imagePreviews.filter((_, idx) => idx !== i);
                            setSelectedImages(newImages);
                            setImagePreviews(newPreviews);
                            toast('ลบรูปภาพแล้ว', { icon: 'ℹ️' });
                          }}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              type="submit"
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
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
              }}
            >
              💾 บันทึกข้อมูลการสำรวจ
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
