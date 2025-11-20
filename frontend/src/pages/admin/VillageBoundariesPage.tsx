/**
 * Village Boundaries Page - Admin
 * กำหนดขอบเขตหมู่บ้าน
 */

import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import VillageBoundaryMap from '../../components/VillageBoundaryMap';
import GeoJSONUploader from '../../components/GeoJSONUploader';
import boundariesService, { type VillageBoundary, type CreateBoundaryDto, type UpdateBoundaryDto } from '../../services/boundariesService';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import './VillageBoundariesPage.css';

interface CoordinateMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  timestamp: Date;
}

export default function VillageBoundariesPage() {
  const [villageBoundaries, setVillageBoundaries] = useState<VillageBoundary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'map' | 'upload'>('map');
  const [drawnBoundary, setDrawnBoundary] = useState<any>(null);
  const [boundaryName, setBoundaryName] = useState('');
  const [selectedVillageNo, setSelectedVillageNo] = useState<number | '' | 'tambon'>('');
  const [editingBoundaryId, setEditingBoundaryId] = useState<string | null>(null);
  
  // Map layer control state
  const [mapLayerType, setMapLayerType] = useState<'street' | 'satellite' | 'hybrid'>('street');
  const [showVillageLegend, setShowVillageLegend] = useState(true);
  
  // Georeference overlay state
  const [georeferenceImage, setGeoreferenceImage] = useState<{
    url: string;
    opacity: number;
    scale: number;
    rotation: number;
    position: [number, number];
    naturalWidth: number;
    naturalHeight: number;
  } | null>(null);

  // Coordinate markers state
  const [coordinateMarkers, setCoordinateMarkers] = useState<CoordinateMarker[]>([]);
  const [inputLat, setInputLat] = useState('');
  const [inputLng, setInputLng] = useState('');
  const [markerLabel, setMarkerLabel] = useState('');
  const [flyToMarker, setFlyToMarker] = useState<CoordinateMarker | null>(null);
  
  // Selected village to view on map
  const [selectedVillageToView, setSelectedVillageToView] = useState<VillageBoundary | null>(null);

  // Load village boundaries
  useEffect(() => {
    loadBoundaries();
  }, []);

  const loadBoundaries = async () => {
    try {
      setLoading(true);
      const data = await boundariesService.getVillageBoundaries();
      
      // แสดงหมู่บ้านทั้งหมด (ทั้งที่มีและไม่มีขอบเขต)
      // เพื่อให้เห็นสถานะที่ถูกต้องของแต่ละหมู่บ้าน
      const allVillages = data.filter(village => 
        village.name && 
        village.name.trim() !== '' && 
        village.villageNo
      );
      setVillageBoundaries(allVillages);
      
      // นับจำนวนหมู่บ้านที่มีขอบเขต
      const withBoundaries = allVillages.filter(v => 
        v.boundary && 
        v.boundary !== null && 
        typeof v.boundary === 'object' &&
        v.boundary.type && 
        v.boundary.coordinates
      );
      
      // Log สำหรับ debug
      console.log(`📊 Total villages: ${allVillages.length}`);
      console.log(`✅ Villages with boundaries: ${withBoundaries.length}`);
      console.log(`❌ Villages without boundaries: ${allVillages.length - withBoundaries.length}`);
      
      if (withBoundaries.length === 0) {
        console.log('💡 ยังไม่มีหมู่บ้านที่มีขอบเขต - เริ่มวาดขอบเขตได้เลย!');
      }
    } catch (error: any) {
      console.error('Error loading boundaries:', error);
      toast.error('ไม่สามารถโหลดข้อมูลขอบเขตได้');
    } finally {
      setLoading(false);
    }
  };

  const handleBoundaryDrawn = (geojson: any) => {
    setDrawnBoundary(geojson);
    toast.success('วาดขอบเขตเรียบร้อย กรุณากรอกข้อมูลและบันทึก');
  };

  const handleSaveDrawnBoundary = async () => {
    if (!drawnBoundary) {
      toast.error('กรุณาวาดขอบเขตก่อน');
      return;
    }

    if (!boundaryName.trim()) {
      toast.error('กรุณากรอกชื่อขอบเขต');
      return;
    }

    try {
      // Check if this is tambon boundary
      if (editingBoundaryId === 'tambon-wiang' || selectedVillageNo === 'tambon') {
        // Save tambon boundary
        await boundariesService.saveTambonBoundary({
          name: boundaryName,
          geojson: drawnBoundary,
          properties: {
            district: 'อำเภอฝาง',
            province: 'จังหวัดเชียงใหม่',
          },
        });
        toast.success('บันทึกขอบเขตตำบลสำเร็จ');
      } else if (editingBoundaryId && editingBoundaryId !== 'tambon-wiang') {
        // Update village boundary
        const centerPoint = {
          type: 'Point',
          coordinates: [
            drawnBoundary.geometry.coordinates[0][0][0],
            drawnBoundary.geometry.coordinates[0][0][1],
          ],
        };
        
        await boundariesService.updateVillageBoundary(
          editingBoundaryId,
          drawnBoundary.geometry,
          centerPoint
        );
        toast.success('แก้ไขขอบเขตหมู่บ้านสำเร็จ');
      } else if (selectedVillageNo && typeof selectedVillageNo === 'number') {
        // Create new village boundary
        // Find village by villageNo
        const village = villageBoundaries.find(v => v.villageNo === selectedVillageNo);
        
        if (!village) {
          toast.error(`ไม่พบข้อมูลหมู่ ${selectedVillageNo}`);
          return;
        }

        // Calculate center point from boundary
        const centerPoint = {
          type: 'Point',
          coordinates: [
            drawnBoundary.geometry.coordinates[0][0][0],
            drawnBoundary.geometry.coordinates[0][0][1],
          ],
        };
        
        // Save to specific village
        await boundariesService.updateVillageBoundary(
          village.id,
          drawnBoundary.geometry,
          centerPoint
        );
        toast.success(`บันทึกขอบเขตหมู่ ${selectedVillageNo} สำเร็จ`);
      } else {
        // Create generic boundary (no village selected)
        const data: CreateBoundaryDto = {
          name: boundaryName,
          type: 'custom',
          geojson: drawnBoundary,
          villageId: undefined,
        };

        await boundariesService.saveDrawnBoundary(data);
        toast.success('บันทึกขอบเขตสำเร็จ');
      }
      
      // Reset form
      setDrawnBoundary(null);
      setBoundaryName('');
      setSelectedVillageNo('');
      setEditingBoundaryId(null);
      
      // Reload boundaries
      loadBoundaries();
    } catch (error: any) {
      console.error('Error saving boundary:', error);
      toast.error(editingBoundaryId ? 'ไม่สามารถแก้ไขขอบเขตได้' : 'ไม่สามารถบันทึกขอบเขตได้');
    }
  };

  const handleGeoJSONUpload = async (geojson: any, filename: string) => {
    try {
      const data: CreateBoundaryDto = {
        name: filename.replace(/\.(geo)?json$/i, ''),
        type: 'custom',
        geojson: geojson,
      };

      await boundariesService.uploadGeoJSON(data);
      toast.success('อัปโหลด GeoJSON สำเร็จ');
      loadBoundaries();
    } catch (error: any) {
      console.error('Error uploading GeoJSON:', error);
      toast.error('ไม่สามารถอัปโหลด GeoJSON ได้');
    }
  };

  const handleEditBoundary = async (villageId: string, villageName: string, villageNo: number) => {
    try {
      // In real app, fetch the full boundary data
      // For now, we'll set edit mode and let user redraw
      setEditingBoundaryId(villageId);
      setBoundaryName(villageName);
      setSelectedVillageNo(villageNo);
      setActiveTab('map');
      toast('กรุณาวาดขอบเขตใหม่เพื่อแก้ไข', { icon: 'ℹ️' });
    } catch (error) {
      console.error('Error loading boundary for edit:', error);
      toast.error('ไม่สามารถโหลดข้อมูลขอบเขตได้');
    }
  };

  const handleEditTambonBoundary = () => {
    // Load tambon boundary for editing
    setEditingBoundaryId('tambon-wiang');
    setBoundaryName('ตำบลเวียง');
    setSelectedVillageNo('tambon' as any);
    setActiveTab('map');
    toast('โหมดแก้ไขขอบเขตตำบล - วาดขอบเขตใหม่บนแผนที่', { 
      icon: '🏛️',
      duration: 4000 
    });
  };

  const handleCancelEdit = () => {
    setEditingBoundaryId(null);
    setDrawnBoundary(null);
    setBoundaryName('');
    setSelectedVillageNo('');
    toast('ยกเลิกการแก้ไข', { icon: 'ℹ️' });
  };

  // Coordinate marker handlers
  const handleAddMarker = () => {
    const lat = parseFloat(inputLat);
    const lng = parseFloat(inputLng);
    
    if (isNaN(lat) || isNaN(lng)) {
      toast.error('กรุณากรอกพิกัดที่ถูกต้อง');
      return;
    }

    if (lat < -90 || lat > 90) {
      toast.error('Latitude ต้องอยู่ระหว่าง -90 ถึง 90');
      return;
    }

    if (lng < -180 || lng > 180) {
      toast.error('Longitude ต้องอยู่ระหว่าง -180 ถึง 180');
      return;
    }
    
    const newMarker: CoordinateMarker = {
      id: Date.now().toString(),
      lat,
      lng,
      label: markerLabel.trim() || `จุดที่ ${coordinateMarkers.length + 1}`,
      timestamp: new Date(),
    };
    
    setCoordinateMarkers([...coordinateMarkers, newMarker]);
    
    // Clear inputs
    setInputLat('');
    setInputLng('');
    setMarkerLabel('');
    
    toast.success(`ปักหมุด "${newMarker.label}" สำเร็จ`);
  };

  const handleRemoveMarker = async (id: string) => {
    const marker = coordinateMarkers.find(m => m.id === id);
    if (!marker) return;

    const result = await Swal.fire({
      title: '⚠️ ยืนยันการลบหมุด',
      html: `
        <p>คุณแน่ใจหรือไม่ที่จะลบหมุดพิกัด:</p>
        <div style="margin: 15px 0; padding: 10px; background: #f8f9fa; border-radius: 8px;">
          <strong style="font-size: 16px;">📍 ${marker.label}</strong><br>
          <span style="color: #666; font-size: 14px;">
            พิกัด: ${marker.lat.toFixed(6)}, ${marker.lng.toFixed(6)}
          </span>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '🗑️ ลบหมุด',
      cancelButtonText: '❌ ยกเลิก',
      focusCancel: true,
    });

    if (result.isConfirmed) {
      setCoordinateMarkers(coordinateMarkers.filter(m => m.id !== id));
      toast.success(`ลบหมุด "${marker.label}" สำเร็จ`);
    }
  };

  const handleGoToMarker = (marker: CoordinateMarker) => {
    setFlyToMarker(marker);
    toast(`กำลังไปยัง "${marker.label}"`, { icon: '🔍' });
  };

  const handleClearInputs = () => {
    setInputLat('');
    setInputLng('');
    setMarkerLabel('');
  };

  // Georeference image handlers
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('กรุณาเลือกไฟล์ภาพ (JPG, PNG)');
      return;
    }

    const url = URL.createObjectURL(file);
    
    // Load image to get natural dimensions
    const img = new Image();
    img.onload = () => {
      setGeoreferenceImage({
        url,
        opacity: 0.7,
        scale: 1.0,
        rotation: 0,
        position: [19.9169, 99.2145], // Default to Fang center
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      });
      toast.success('โหลดภาพสำเร็จ - ลากเพื่อวางตำแหน่ง');
    };
    img.src = url;
  };

  const handleRemoveGeoreferenceImage = async () => {
    if (!georeferenceImage) return;

    const result = await Swal.fire({
      title: '⚠️ ยืนยันการลบภาพอ้างอิง',
      html: `
        <p>คุณแน่ใจหรือไม่ที่จะลบภาพอ้างอิงที่กำลังแสดงอยู่?</p>
        <div style="margin-top: 10px; padding: 10px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
          <small style="color: #856404;">
            ⚠️ ตำแหน่งที่ปรับไว้จะถูกรีเซ็ต
          </small>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '🗑️ ลบภาพ',
      cancelButtonText: '❌ ยกเลิก',
      focusCancel: true,
    });

    if (result.isConfirmed) {
      URL.revokeObjectURL(georeferenceImage.url);
      setGeoreferenceImage(null);
      toast.success('ลบภาพอ้างอิงแล้ว');
    }
  };

  const updateGeoreferenceProperty = (property: string, value: number) => {
    if (!georeferenceImage) return;
    setGeoreferenceImage({
      ...georeferenceImage,
      [property]: value,
    });
  };

  const updateGeoreferencePosition = (position: [number, number]) => {
    if (!georeferenceImage) return;
    setGeoreferenceImage({
      ...georeferenceImage,
      position,
    });
  };

  const handleExportGeoJSON = () => {
    if (villageBoundaries.length === 0) {
      toast.error('ไม่มีข้อมูลขอบเขตให้ส่งออก');
      return;
    }

    const featureCollection = {
      type: 'FeatureCollection',
      features: villageBoundaries.map(v => ({
        type: 'Feature',
        properties: {
          villageNo: v.villageNo,
          name: v.name,
        },
        geometry: v.boundary,
      })),
    };

    const blob = new Blob([JSON.stringify(featureCollection, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `village-boundaries-${new Date().toISOString().split('T')[0]}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('ส่งออก GeoJSON สำเร็จ');
  };

  return (
    <DashboardLayout>
      <div className="village-boundaries-page">
        <div className="page-header">
          <div>
            <h1>🌐 กำหนดขอบเขตหมู่บ้าน</h1>
            <p className="subtitle">เครื่องมือเชิงแผนที่สำหรับวาดและแก้ไขขอบเขตหมู่บ้าน</p>
          </div>
          <div className="header-actions">
            <button className="btn-edit-tambon" onClick={handleEditTambonBoundary}>
              🏛️ แก้ไขขอบเขตตำบล
            </button>
            <button className="btn-export" onClick={handleExportGeoJSON}>
              📥 ส่งออก GeoJSON
            </button>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => setActiveTab('map')}
          >
            🗺️ แผนที่
          </button>
          <button
            className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            📁 อัปโหลด GeoJSON
          </button>
        </div>

        <div className="content">
          {activeTab === 'map' && (
            <div className={`map-section ${!drawnBoundary ? 'full-width' : ''}`}>
              {/* Coordinate Marker Section - แสดงเฉพาะเมื่อกำลังวาดหรือแก้ไข */}
              {(drawnBoundary || editingBoundaryId) && (
                <div className="coordinate-marker-section">
                  <h3>📍 ปักหมุดพิกัดอ้างอิง</h3>
                  <p className="section-description">กรอกพิกัดเพื่อปักหมุดจุดอ้างอิงก่อนวาดขอบเขต</p>
                  
                  <div className="coordinate-inputs">
                    <div className="input-group">
                      <label>Latitude (ละติจูด):</label>
                      <input
                        type="number"
                        step="any"
                        value={inputLat}
                        onChange={(e) => setInputLat(e.target.value)}
                        placeholder="19.93842280996853"
                        className="coordinate-input"
                      />
                    </div>
                    
                    <div className="input-group">
                      <label>Longitude (ลองจิจูด):</label>
                      <input
                        type="number"
                        step="any"
                        value={inputLng}
                        onChange={(e) => setInputLng(e.target.value)}
                        placeholder="99.23076089434804"
                        className="coordinate-input"
                      />
                    </div>
                    
                    <div className="input-group full-width">
                      <label>ชื่อจุด:</label>
                      <input
                        type="text"
                        value={markerLabel}
                        onChange={(e) => setMarkerLabel(e.target.value)}
                        placeholder="จุดเริ่มต้นหมู่ 1"
                        className="coordinate-input"
                      />
                    </div>
                  </div>
                  
                  <div className="marker-actions">
                    <button onClick={handleAddMarker} className="btn-add-marker">
                      🎯 ปักหมุด
                    </button>
                    <button onClick={handleClearInputs} className="btn-clear">
                      🗑️ ล้าง
                    </button>
                  </div>

                  {coordinateMarkers.length > 0 && (
                    <div className="markers-list">
                      <h4>พิกัดที่ปักไว้ ({coordinateMarkers.length})</h4>
                      <div className="markers-grid">
                        {coordinateMarkers.map((marker) => (
                          <div key={marker.id} className="marker-item">
                            <div className="marker-info">
                              <strong>📍 {marker.label}</strong>
                              <span className="marker-coords">
                                {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                              </span>
                            </div>
                            <div className="marker-item-actions">
                              <button 
                                onClick={() => handleGoToMarker(marker)}
                                className="btn-goto"
                                title="ไปยังตำแหน่ง"
                              >
                                🔍 ไป
                              </button>
                              <button 
                                onClick={() => handleRemoveMarker(marker.id)}
                                className="btn-remove"
                                title="ลบหมุด"
                              >
                                🗑️ ลบ
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {editingBoundaryId === 'tambon-wiang' && (
                <div className="edit-mode-banner">
                  🏛️ โหมดแก้ไขขอบเขตตำบล - ขอบเขตหมู่บ้านถูกซ่อนเพื่อความชัดเจน
                </div>
              )}
              {/* External Map Controls Panel */}
              <div className="external-map-controls">
                <div className="control-section">
                  <h4>🗺️ ประเภทแผนที่</h4>
                  <div className="layer-options">
                    <label className={`layer-option ${mapLayerType === 'street' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="mapLayer"
                        value="street"
                        checked={mapLayerType === 'street'}
                        onChange={(e) => setMapLayerType(e.target.value as any)}
                      />
                      <span className="layer-icon">🗺️</span>
                      <span className="layer-label">แผนที่ถนน</span>
                    </label>
                    <label className={`layer-option ${mapLayerType === 'satellite' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="mapLayer"
                        value="satellite"
                        checked={mapLayerType === 'satellite'}
                        onChange={(e) => setMapLayerType(e.target.value as any)}
                      />
                      <span className="layer-icon">🛰️</span>
                      <span className="layer-label">ภาพถ่ายดาวเทียม</span>
                    </label>
                    <label className={`layer-option ${mapLayerType === 'hybrid' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="mapLayer"
                        value="hybrid"
                        checked={mapLayerType === 'hybrid'}
                        onChange={(e) => setMapLayerType(e.target.value as any)}
                      />
                      <span className="layer-icon">🌐</span>
                      <span className="layer-label">ภาพถ่าย + ชื่อ</span>
                    </label>
                  </div>
                </div>

                {villageBoundaries.filter(v => v.boundary).length > 0 && (
                  <div className="control-section">
                    <div className="section-header">
                      <h4>🎨 สีขอบเขตหมู่บ้าน</h4>
                      <button 
                        className="toggle-legend-btn"
                        onClick={() => setShowVillageLegend(!showVillageLegend)}
                      >
                        {showVillageLegend ? '👁️ ซ่อน' : '👁️‍🗨️ แสดง'}
                      </button>
                    </div>
                    {showVillageLegend && (
                      <div className="village-color-legend">
                        {villageBoundaries
                          .filter(v => v.boundary && v.villageNo)
                          .sort((a, b) => a.villageNo - b.villageNo)
                          .map((boundary) => {
                            const getVillageColor = (villageNo: number): string => {
                              const colors = [
                                '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
                                '#1abc9c', '#e67e22', '#34495e', '#16a085', '#c0392b',
                                '#27ae60', '#2980b9', '#8e44ad', '#f1c40f', '#d35400',
                                '#7f8c8d', '#e91e63', '#00bcd4', '#4caf50', '#ff5722',
                              ];
                              return colors[(villageNo - 1) % colors.length];
                            };
                            const color = getVillageColor(boundary.villageNo);
                            return (
                              <div key={boundary.id} className="legend-item">
                                <div 
                                  className="legend-color" 
                                  style={{ background: color }}
                                />
                                <span className="legend-label">หมู่ {boundary.villageNo} - {boundary.name}</span>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="map-wrapper">
                <VillageBoundaryMap
                  onBoundaryDrawn={handleBoundaryDrawn}
                  existingBoundaries={editingBoundaryId === 'tambon-wiang' ? [] : villageBoundaries}
                  georeferenceOverlay={georeferenceImage}
                  onGeoreferencePositionChange={updateGeoreferencePosition}
                  coordinateMarkers={coordinateMarkers}
                  flyToMarker={flyToMarker}
                  onFlyToComplete={() => setFlyToMarker(null)}
                  mapLayerType={mapLayerType}
                  showLegendOnMap={false}
                  selectedVillageToView={selectedVillageToView}
                  onViewComplete={() => setSelectedVillageToView(null)}
                />
              </div>

              {drawnBoundary && (
                <div className="save-form">
                  <h3>💾 บันทึกขอบเขตที่วาด</h3>
                  <div className="form-group">
                    <label>ชื่อขอบเขต *</label>
                    <input
                      type="text"
                      value={boundaryName}
                      onChange={(e) => setBoundaryName(e.target.value)}
                      placeholder="เช่น หมู่ 1 - หนองตุ้ม"
                    />
                  </div>
                  <div className="form-group">
                    <label>ประเภทขอบเขต</label>
                    <select
                      value={selectedVillageNo}
                      onChange={(e) => setSelectedVillageNo(e.target.value ? Number(e.target.value) : '')}
                    >
                      <option value="">-- เลือกพื้นที่ --</option>
                      <option value="tambon">🏛️ ขอบเขตตำบลเวียง</option>
                      <optgroup label="หมู่บ้าน">
                        {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>หมู่ {num}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                  <div className="button-group">
                    <button className="btn-save" onClick={handleSaveDrawnBoundary}>
                      {editingBoundaryId ? '✏️ บันทึกการแก้ไข' : '💾 บันทึกขอบเขต'}
                    </button>
                    {editingBoundaryId && (
                      <button className="btn-cancel" onClick={handleCancelEdit}>
                        ❌ ยกเลิก
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Georeference Image Tool */}
              <div className="georeference-panel">
                <h3>🗺️ Georeference Image Tool</h3>
                <p className="tool-description">
                  นำเข้าภาพแผนที่/ภาพถ่ายทางอากาศเพื่อทาบบนแผนที่ดิจิทัล
                </p>
                
                {!georeferenceImage ? (
                  <div className="upload-area">
                    <input
                      type="file"
                      id="georeference-upload"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="georeference-upload" className="upload-button">
                      📷 เลือกภาพ (JPG, PNG)
                    </label>
                  </div>
                ) : (
                  <div className="georeference-controls">
                    <div className="control-group">
                      <label>
                        ความโปร่งใส (Opacity): {(georeferenceImage.opacity * 100).toFixed(0)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={georeferenceImage.opacity}
                        onChange={(e) => updateGeoreferenceProperty('opacity', parseFloat(e.target.value))}
                      />
                    </div>

                    <div className="control-group">
                      <label>
                        ขนาด (Scale): {georeferenceImage.scale.toFixed(2)}x
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="5"
                        step="0.1"
                        value={georeferenceImage.scale}
                        onChange={(e) => updateGeoreferenceProperty('scale', parseFloat(e.target.value))}
                      />
                    </div>

                    <div className="control-group">
                      <label>
                        การหมุน (Rotation): {georeferenceImage.rotation}°
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="1"
                        value={georeferenceImage.rotation}
                        onChange={(e) => updateGeoreferenceProperty('rotation', parseFloat(e.target.value))}
                      />
                    </div>

                    <button className="btn-remove" onClick={handleRemoveGeoreferenceImage}>
                      🗑️ ลบภาพอ้างอิง
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="upload-section">
              <GeoJSONUploader onUpload={handleGeoJSONUpload} />
              <div className="upload-info">
                <h3>📝 คำแนะนำ</h3>
                <ul>
                  <li>รองรับไฟล์ .json และ .geojson</li>
                  <li>GeoJSON ต้องเป็น Feature, FeatureCollection, Polygon หรือ MultiPolygon</li>
                  <li>ไฟล์จะถูกบันทึกลงฐานข้อมูลทันที</li>
                  <li>สามารถอัปโหลดหลายไฟล์ได้</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="boundaries-list">
          <div className="list-header">
            <h2>📋 รายการขอบเขตที่บันทึกแล้ว ({villageBoundaries.length})</h2>
            <div className="list-controls">
              <input
                type="text"
                className="search-input"
                placeholder="🔍 ค้นหาหมู่บ้าน..."
                onChange={(e) => {
                  const search = e.target.value.toLowerCase();
                  const filtered = villageBoundaries.filter(b => 
                    b.name.toLowerCase().includes(search) || 
                    b.villageNo.toString().includes(search)
                  );
                  // Update filtered list (implement state if needed)
                }}
              />
              <select className="sort-select">
                <option value="no">เรียงตามหมู่</option>
                <option value="name">เรียงตามชื่อ</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading">กำลังโหลด...</div>
          ) : villageBoundaries.length === 0 ? (
            <div className="empty-state">
              <p>ยังไม่มีข้อมูลขอบเขต</p>
              <p className="hint">เริ่มต้นด้วยการวาดขอบเขตบนแผนที่ หรืออัปโหลดไฟล์ GeoJSON</p>
            </div>
          ) : (
            <div className="boundaries-table">
              <table>
                <thead>
                  <tr>
                    <th>หมู่</th>
                    <th>ชื่อหมู่บ้าน</th>
                    <th>พิกัดกลาง</th>
                    <th>สถานะ</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {villageBoundaries.map((boundary) => {
                    // Function to get village color (same as map)
                    const getVillageColor = (villageNo: number): string => {
                      const colors = [
                        '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
                        '#1abc9c', '#e67e22', '#34495e', '#16a085', '#c0392b',
                        '#27ae60', '#2980b9', '#8e44ad', '#f1c40f', '#d35400',
                        '#7f8c8d', '#e91e63', '#00bcd4', '#4caf50', '#ff5722',
                      ];
                      return colors[(villageNo - 1) % colors.length];
                    };
                    
                    const villageColor = getVillageColor(boundary.villageNo);
                    
                    return (
                    <tr key={boundary.id}>
                      <td className="village-no">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {boundary.boundary && (
                            <div 
                              style={{ 
                                width: '12px', 
                                height: '12px', 
                                background: villageColor, 
                                borderRadius: '2px',
                                border: '1px solid #ccc',
                                flexShrink: 0
                              }}
                              title={`สีขอบเขตหมู่ ${boundary.villageNo}`}
                            />
                          )}
                          <span className="badge-number">{boundary.villageNo}</span>
                        </div>
                      </td>
                      <td className="village-name-cell">
                        <strong>{boundary.name}</strong>
                      </td>
                      <td className="coordinates">
                        {boundary.centerPoint ? (
                          <span className="coord-text">
                            {boundary.centerPoint.coordinates[1].toFixed(4)}, {boundary.centerPoint.coordinates[0].toFixed(4)}
                          </span>
                        ) : (
                          <span className="no-data">-</span>
                        )}
                      </td>
                      <td className="status">
                        {boundary.boundary ? (
                          <span className="badge-success">✅ มีขอบเขต</span>
                        ) : (
                          <span className="badge-warning">⚠️ ยังไม่มีขอบเขต</span>
                        )}
                      </td>
                      <td className="actions">
                        <button 
                          className="btn-action btn-view"
                          onClick={() => {
                            // Center map on this village
                            if (boundary.centerPoint || boundary.boundary) {
                              setSelectedVillageToView(boundary);
                              setActiveTab('map');
                              toast('📍 แสดงตำแหน่งหมู่ ' + boundary.villageNo + ' - ' + boundary.name, { icon: '🗺️' });
                            } else {
                              toast.error('หมู่บ้านนี้ยังไม่มีข้อมูลตำแหน่ง');
                            }
                          }}
                          title="ดูบนแผนที่"
                        >
                          🗺️
                        </button>
                        <button 
                          className="btn-action btn-edit"
                          onClick={() => handleEditBoundary(boundary.id, boundary.name, boundary.villageNo)}
                          title="แก้ไข"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-action btn-delete"
                          onClick={async () => {
                            const result = await Swal.fire({
                              title: '⚠️ ยืนยันการลบขอบเขต',
                              html: `
                                <p>คุณแน่ใจหรือไม่ที่จะลบขอบเขต:</p>
                                <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #dc3545;">
                                  <strong style="font-size: 18px; color: #dc3545;">หมู่ ${boundary.villageNo} - ${boundary.name}</strong>
                                </div>
                                <div style="margin-top: 15px; padding: 12px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
                                  <strong style="color: #856404;">⚠️ คำเตือน:</strong><br>
                                  <small style="color: #856404;">
                                    ขอบเขตจะถูกลบอย่างถาวร และไม่สามารถกู้คืนได้!
                                  </small>
                                </div>
                              `,
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonColor: '#dc3545',
                              cancelButtonColor: '#6c757d',
                              confirmButtonText: '🗑️ ยืนยันลบขอบเขต',
                              cancelButtonText: '❌ ยกเลิก',
                              focusCancel: true,
                            });

                            if (result.isConfirmed) {
                              try {
                                await boundariesService.deleteVillageBoundary(boundary.id);
                                toast.success(`ลบขอบเขต ${boundary.name} สำเร็จ`);
                                loadBoundaries();
                              } catch (error) {
                                console.error('Error deleting boundary:', error);
                                toast.error('ไม่สามารถลบขอบเขตได้');
                              }
                            }
                          }}
                          title="ลบ"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
