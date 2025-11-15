/**
 * Village Boundaries Page - Admin
 * กำหนดขอบเขตหมู่บ้าน
 */

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import VillageBoundaryMap from '../../components/VillageBoundaryMap';
import GeoJSONUploader from '../../components/GeoJSONUploader';
import boundariesService, { type VillageBoundary, type CreateBoundaryDto, type UpdateBoundaryDto } from '../../services/boundariesService';
import toast from 'react-hot-toast';
import './VillageBoundariesPage.css';

export default function VillageBoundariesPage() {
  const [villageBoundaries, setVillageBoundaries] = useState<VillageBoundary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'map' | 'upload'>('map');
  const [drawnBoundary, setDrawnBoundary] = useState<any>(null);
  const [boundaryName, setBoundaryName] = useState('');
  const [selectedVillageNo, setSelectedVillageNo] = useState<number | ''>('');
  const [editingBoundaryId, setEditingBoundaryId] = useState<string | null>(null);

  // Load village boundaries
  useEffect(() => {
    loadBoundaries();
  }, []);

  const loadBoundaries = async () => {
    try {
      setLoading(true);
      const data = await boundariesService.getVillageBoundaries();
      setVillageBoundaries(data);
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
      if (editingBoundaryId) {
        // Update existing boundary
        const data: UpdateBoundaryDto = {
          name: boundaryName,
          type: selectedVillageNo ? 'village' : 'custom',
          geojson: drawnBoundary,
        };

        await boundariesService.updateBoundary(editingBoundaryId, data);
        toast.success('แก้ไขขอบเขตสำเร็จ');
      } else {
        // Create new boundary
        const data: CreateBoundaryDto = {
          name: boundaryName,
          type: selectedVillageNo ? 'village' : 'custom',
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

  const handleCancelEdit = () => {
    setEditingBoundaryId(null);
    setDrawnBoundary(null);
    setBoundaryName('');
    setSelectedVillageNo('');
    toast('ยกเลิกการแก้ไข', { icon: 'ℹ️' });
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
          <button className="btn-export" onClick={handleExportGeoJSON}>
            📥 ส่งออก GeoJSON
          </button>
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
            <div className="map-section">
              <div className="map-wrapper">
                <VillageBoundaryMap
                  onBoundaryDrawn={handleBoundaryDrawn}
                  existingBoundaries={villageBoundaries}
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
                    <label>หมู่บ้าน (ถ้ามี)</label>
                    <select
                      value={selectedVillageNo}
                      onChange={(e) => setSelectedVillageNo(e.target.value ? Number(e.target.value) : '')}
                    >
                      <option value="">-- เลือกหมู่บ้าน --</option>
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>หมู่ {num}</option>
                      ))}
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
          <h2>📋 รายการขอบเขตที่บันทึกแล้ว ({villageBoundaries.length})</h2>
          {loading ? (
            <div className="loading">กำลังโหลด...</div>
          ) : villageBoundaries.length === 0 ? (
            <div className="empty-state">
              <p>ยังไม่มีข้อมูลขอบเขต</p>
              <p className="hint">เริ่มต้นด้วยการวาดขอบเขตบนแผนที่ หรืออัปโหลดไฟล์ GeoJSON</p>
            </div>
          ) : (
            <div className="boundaries-grid">
              {villageBoundaries.map((boundary) => (
                <div key={boundary.id} className="boundary-card">
                  <div className="card-header">
                    <h4>หมู่ {boundary.villageNo}</h4>
                    <span className="badge">✅ มีขอบเขต</span>
                  </div>
                  <p className="village-name">{boundary.name}</p>
                  <div className="card-actions">
                    <button 
                      className="btn-edit-small"
                      onClick={() => handleEditBoundary(boundary.id, boundary.name, boundary.villageNo)}
                    >
                      ✏️ แก้ไข
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
