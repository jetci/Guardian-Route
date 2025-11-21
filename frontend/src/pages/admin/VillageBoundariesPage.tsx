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
  
  // Search and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'no' | 'name' | 'status'>('no');
  
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
  
  // Export selection state
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedVillagesForExport, setSelectedVillagesForExport] = useState<string[]>([]);
  
  // Import batch state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFiles, setImportFiles] = useState<File[]>([]);
  const [importProgress, setImportProgress] = useState<{
    current: number;
    total: number;
    status: 'idle' | 'processing' | 'completed' | 'error';
    results: Array<{ file: string; status: 'success' | 'error'; error?: string }>;
  }>({ current: 0, total: 0, status: 'idle', results: [] });
  
  // Undo/Redo history state
  const [drawHistory, setDrawHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const MAX_HISTORY = 20; // จำกัดประวัติไม่เกิน 20 ขั้นตอน

  // Load village boundaries
  useEffect(() => {
    loadBoundaries();
  }, []);

  // Keyboard shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z or Cmd+Z for Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Ctrl+Y or Cmd+Y or Ctrl+Shift+Z for Redo
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, drawHistory]);

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
    addToHistory(geojson);
    toast.success('วาดขอบเขตเรียบร้อย กรุณากรอกข้อมูลและบันทึก');
  };

  // Undo/Redo functions
  const addToHistory = (geojson: any) => {
    if (!geojson) return;
    
    // Remove any redo history (ถ้ามีการวาดใหม่ หลังจาก undo)
    const newHistory = drawHistory.slice(0, historyIndex + 1);
    
    // Add new state
    newHistory.push(geojson);
    
    // Limit history size
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
      setDrawHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } else {
      setDrawHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    
    console.log(`📝 Added to history. Index: ${newHistory.length - 1}, Total: ${newHistory.length}`);
  };

  const handleUndo = () => {
    if (historyIndex <= 0) {
      toast('ไม่มีประวัติให้ย้อนกลับ', { icon: 'ℹ️' });
      return;
    }
    
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setDrawnBoundary(drawHistory[newIndex]);
    toast('↩️ Undo', { icon: 'ℹ️', duration: 1500 });
    console.log(`↩️ Undo to index: ${newIndex}`);
  };

  const handleRedo = () => {
    if (historyIndex >= drawHistory.length - 1) {
      toast('ไม่มีประวัติให้ทำซ้ำ', { icon: 'ℹ️' });
      return;
    }
    
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setDrawnBoundary(drawHistory[newIndex]);
    toast('↪️ Redo', { icon: 'ℹ️', duration: 1500 });
    console.log(`↪️ Redo to index: ${newIndex}`);
  };

  const clearHistory = () => {
    setDrawHistory([]);
    setHistoryIndex(-1);
    console.log('🗑️ History cleared');
  };

  // ล้างการวาดและวาดใหม่
  const handleClearDrawing = () => {
    setDrawnBoundary(null);
    clearHistory();
    toast.success('🗑️ ล้างการวาดแล้ว - วาดใหม่ได้เลย');
    console.log('🗑️ Cleared drawing for redraw');
  };

  // ยกเลิกการวาดทั้งหมด
  const handleCancelDrawing = () => {
    setDrawnBoundary(null);
    setBoundaryName('');
    setSelectedVillageNo('');
    setEditingBoundaryId(null);
    clearHistory();
    toast('❌ ยกเลิกการวาดแล้ว', { icon: 'ℹ️' });
    console.log('❌ Cancelled drawing');
  };

  const handleSaveDrawnBoundary = async () => {
    // Validation
    if (!drawnBoundary) {
      toast.error('กรุณาวาดขอบเขตก่อน');
      return;
    }

    if (!boundaryName.trim()) {
      toast.error('กรุณากรอกชื่อขอบเขต');
      return;
    }

    // Validate geometry
    if (!drawnBoundary.geometry || !drawnBoundary.geometry.coordinates) {
      toast.error('ข้อมูลขอบเขตไม่ถูกต้อง');
      return;
    }

    // Calculate proper center point from polygon
    const calculateCenterPoint = (coordinates: number[][][]): [number, number] => {
      try {
        // Validate coordinates
        if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
          throw new Error('Invalid coordinates: empty or undefined');
        }
        
        const coords = coordinates[0];
        if (!coords || !Array.isArray(coords) || coords.length === 0) {
          throw new Error('Invalid coordinates: no points');
        }
        
        // Calculate centroid
        let sumLat = 0, sumLng = 0;
        coords.forEach(coord => {
          if (coord && coord.length >= 2) {
            sumLng += coord[0];
            sumLat += coord[1];
          }
        });
        
        return [sumLng / coords.length, sumLat / coords.length];
      } catch (error) {
        console.error('Error calculating center:', error);
        // Fallback to safe default (center of Thailand)
        return [99.0, 18.8];
      }
    };

    try {
      const loadingToast = toast.loading('กำลังบันทึก...');

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
        toast.dismiss(loadingToast);
        toast.success('บันทึกขอบเขตตำบลสำเร็จ');
      } else if (editingBoundaryId && editingBoundaryId !== 'tambon-wiang') {
        // Update village boundary
        if (!drawnBoundary.geometry?.coordinates) {
          toast.dismiss(loadingToast);
          toast.error('ข้อมูลขอบเขตไม่ถูกต้อง: ไม่มีพิกัด');
          return;
        }
        const [lng, lat] = calculateCenterPoint(drawnBoundary.geometry.coordinates);
        const centerPoint = {
          type: 'Point',
          coordinates: [lng, lat],
        };
        
        await boundariesService.updateVillageBoundary(
          editingBoundaryId,
          drawnBoundary.geometry,
          centerPoint
        );
        toast.dismiss(loadingToast);
        toast.success('แก้ไขขอบเขตหมู่บ้านสำเร็จ');
      } else if (selectedVillageNo && typeof selectedVillageNo === 'number') {
        // Create new village boundary
        const village = villageBoundaries.find(v => v.villageNo === selectedVillageNo);
        
        if (!village) {
          toast.dismiss(loadingToast);
          toast.error(`ไม่พบข้อมูลหมู่ ${selectedVillageNo}`);
          return;
        }

        // Calculate center point from boundary
        if (!drawnBoundary.geometry?.coordinates) {
          toast.dismiss(loadingToast);
          toast.error('ข้อมูลขอบเขตไม่ถูกต้อง: ไม่มีพิกัด');
          return;
        }
        const [lng, lat] = calculateCenterPoint(drawnBoundary.geometry.coordinates);
        const centerPoint = {
          type: 'Point',
          coordinates: [lng, lat],
        };
        
        // Save to specific village
        await boundariesService.updateVillageBoundary(
          village.id,
          drawnBoundary.geometry,
          centerPoint
        );
        toast.dismiss(loadingToast);
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
        toast.dismiss(loadingToast);
        toast.success('บันทึกขอบเขตสำเร็จ');
      }
      
      // Reset form
      setDrawnBoundary(null);
      setBoundaryName('');
      setSelectedVillageNo('');
      setEditingBoundaryId(null);
      
      // Clear history
      clearHistory();
      
      // Reload boundaries
      await loadBoundaries();
    } catch (error: any) {
      console.error('Error saving boundary:', error);
      const errorMessage = error.response?.data?.message || error.message || 'เกิดข้อผิดพลาด';
      toast.error(editingBoundaryId ? `ไม่สามารถแก้ไขขอบเขตได้: ${errorMessage}` : `ไม่สามารถบันทึกขอบเขตได้: ${errorMessage}`);
    }
  };

  const handleGeoJSONUpload = async (geojson: any, filename: string) => {
    try {
      // Validate GeoJSON structure
      if (!geojson || typeof geojson !== 'object') {
        toast.error('ไฟล์ GeoJSON ไม่ถูกต้อง');
        return;
      }

      const loadingToast = toast.loading('กำลังอัปโหลด...');

      const data: CreateBoundaryDto = {
        name: filename.replace(/\.(geo)?json$/i, ''),
        type: 'custom',
        geojson: geojson,
      };

      await boundariesService.uploadGeoJSON(data);
      toast.dismiss(loadingToast);
      toast.success('อัปโหลด GeoJSON สำเร็จ');
      await loadBoundaries();
    } catch (error: any) {
      console.error('Error uploading GeoJSON:', error);
      const errorMessage = error.response?.data?.message || error.message || 'เกิดข้อผิดพลาด';
      toast.error(`ไม่สามารถอัปโหลด GeoJSON ได้: ${errorMessage}`);
    }
  };

  const handleEditBoundary = async (villageId: string, villageName: string, villageNo: number) => {
    try {
      // Confirm before editing
      const result = await Swal.fire({
        title: '✏️ แก้ไขขอบเขต',
        html: `
          <p>คุณต้องการแก้ไขขอบเขตของ:</p>
          <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <strong style="font-size: 18px; color: #3b82f6;">หมู่ ${villageNo} - ${villageName}</strong>
          </div>
          <div style="margin-top: 15px; padding: 12px; background: #e3f2fd; border-radius: 8px;">
            <small style="color: #1976d2;">
              ℹ️ กรุณาวาดขอบเขตใหม่บนแผนที่
            </small>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '✏️ เริ่มแก้ไข',
        cancelButtonText: '❌ ยกเลิก',
      });

      if (result.isConfirmed) {
        setEditingBoundaryId(villageId);
        setBoundaryName(villageName);
        setSelectedVillageNo(villageNo);
        setActiveTab('map');
        toast('โหมดแก้ไข: วาดขอบเขตใหม่บนแผนที่', { 
          icon: '✏️',
          duration: 5000 
        });
      }
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
    console.log('🔍 Export button clicked!');
    console.log('📊 Total villages:', villageBoundaries.length);
    
    const withBoundaries = villageBoundaries.filter(v => v.boundary);
    console.log('✅ Villages with boundaries:', withBoundaries.length);
    
    if (withBoundaries.length === 0) {
      toast.error('ไม่มีข้อมูลขอบเขตให้ส่งออก');
      return;
    }

    // Show export modal for selection
    setSelectedVillagesForExport([]);
    setShowExportModal(true);
    console.log('✅ Modal should open now!');
  };

  const handleConfirmExport = () => {
    const villagesToExport = selectedVillagesForExport.length > 0
      ? villageBoundaries.filter(v => selectedVillagesForExport.includes(v.id) && v.boundary)
      : villageBoundaries.filter(v => v.boundary);

    if (villagesToExport.length === 0) {
      toast.error('กรุณาเลือกหมู่บ้านที่ต้องการส่งออก');
      return;
    }

    const featureCollection = {
      type: 'FeatureCollection',
      features: villagesToExport.map(v => ({
        type: 'Feature',
        properties: {
          villageNo: v.villageNo,
          name: v.name,
          id: v.id,
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
    const filename = selectedVillagesForExport.length > 0
      ? `village-boundaries-selected-${villagesToExport.length}-${new Date().toISOString().split('T')[0]}.geojson`
      : `village-boundaries-all-${new Date().toISOString().split('T')[0]}.geojson`;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    setShowExportModal(false);
    toast.success(`ส่งออก ${villagesToExport.length} หมู่บ้านสำเร็จ`);
  };

  const toggleVillageSelection = (villageId: string) => {
    setSelectedVillagesForExport(prev => 
      prev.includes(villageId)
        ? prev.filter(id => id !== villageId)
        : [...prev, villageId]
    );
  };

  const selectAllVillages = () => {
    const allIds = villageBoundaries.filter(v => v.boundary).map(v => v.id);
    setSelectedVillagesForExport(allIds);
  };

  const deselectAllVillages = () => {
    setSelectedVillagesForExport([]);
  };

  // Import batch functions
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(f => 
      f.name.endsWith('.json') || f.name.endsWith('.geojson')
    );
    
    if (validFiles.length === 0) {
      toast.error('กรุณาเลือกไฟล์ GeoJSON (.json หรือ .geojson)');
      return;
    }
    
    if (validFiles.length !== fileArray.length) {
      toast(`เลือกเฉพาะไฟล์ GeoJSON ${validFiles.length}/${fileArray.length} ไฟล์`, { icon: '⚠️' });
    }
    
    setImportFiles(validFiles);
    setImportProgress({ current: 0, total: 0, status: 'idle', results: [] });
    console.log('📁 Selected files:', validFiles.map(f => f.name));
  };

  const validateGeoJSON = (data: any): boolean => {
    try {
      if (!data || typeof data !== 'object') return false;
      
      // Check if it's a Feature or FeatureCollection
      if (data.type === 'Feature' && data.geometry) return true;
      if (data.type === 'FeatureCollection' && Array.isArray(data.features)) return true;
      if (data.type === 'Polygon' && Array.isArray(data.coordinates)) return true;
      
      return false;
    } catch (error) {
      return false;
    }
  };

  const handleBatchImport = async () => {
    if (importFiles.length === 0) {
      toast.error('กรุณาเลือกไฟล์ก่อน');
      return;
    }

    setImportProgress({
      current: 0,
      total: importFiles.length,
      status: 'processing',
      results: []
    });

    const results: Array<{ file: string; status: 'success' | 'error'; error?: string }> = [];

    for (let i = 0; i < importFiles.length; i++) {
      const file = importFiles[i];
      
      try {
        console.log(`📥 Importing ${i + 1}/${importFiles.length}: ${file.name}`);
        
        const text = await file.text();
        const geojson = JSON.parse(text);
        
        // Validate GeoJSON
        if (!validateGeoJSON(geojson)) {
          throw new Error('รูปแบบ GeoJSON ไม่ถูกต้อง');
        }
        
        // Import to backend
        const data: CreateBoundaryDto = {
          name: file.name.replace(/\.(geo)?json$/i, ''),
          type: 'custom',
          geojson: geojson,
        };
        
        await boundariesService.uploadGeoJSON(data);
        
        results.push({ file: file.name, status: 'success' });
        console.log(`✅ Imported: ${file.name}`);
        
      } catch (error: any) {
        const errorMsg = error.response?.data?.message || error.message || 'เกิดข้อผิดพลาด';
        results.push({ file: file.name, status: 'error', error: errorMsg });
        console.error(`❌ Failed: ${file.name}`, error);
      }
      
      setImportProgress({
        current: i + 1,
        total: importFiles.length,
        status: 'processing',
        results: [...results]
      });
    }

    setImportProgress(prev => ({ ...prev, status: 'completed' }));

    // Show summary
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    
    if (successCount > 0) {
      toast.success(`นำเข้าสำเร็จ ${successCount}/${importFiles.length} ไฟล์`);
    }
    if (errorCount > 0) {
      toast.error(`นำเข้าล้มเหลว ${errorCount}/${importFiles.length} ไฟล์`);
    }

    // Reload boundaries
    await loadBoundaries();
  };

  const handleCloseImportModal = () => {
    setShowImportModal(false);
    setImportFiles([]);
    setImportProgress({ current: 0, total: 0, status: 'idle', results: [] });
  };

  return (
    <DashboardLayout>
      <div className="village-boundaries-page">
        <div className="page-header">
          <div>
            <h1>🌐 กำหนดขอบเขตหมู่บ้าน</h1>
            <p className="subtitle">เครื่องมือเชิงแผนที่สำหรับวาดและแก้ไขขอบเขตหมู่บ้าน</p>
            {/* Statistics Summary */}
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1.5rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>📊 ทั้งหมด:</span>
                <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{villageBoundaries.length}</strong>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>หมู่</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>✅ มีขอบเขต:</span>
                <strong style={{ color: '#4ade80', fontSize: '1.1rem' }}>
                  {villageBoundaries.filter(v => v.boundary).length}
                </strong>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>หมู่</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>⚠️ ยังไม่มี:</span>
                <strong style={{ color: '#fbbf24', fontSize: '1.1rem' }}>
                  {villageBoundaries.filter(v => !v.boundary).length}
                </strong>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>หมู่</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>📈 ความสมบูรณ์:</span>
                <strong style={{ color: '#fff', fontSize: '1.1rem' }}>
                  {villageBoundaries.length > 0 
                    ? Math.round((villageBoundaries.filter(v => v.boundary).length / villageBoundaries.length) * 100)
                    : 0}%
                </strong>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-edit-tambon" onClick={handleEditTambonBoundary}>
              🏛️ แก้ไขขอบเขตตำบล
            </button>
            <button 
              className="btn-import" 
              onClick={() => setShowImportModal(true)}
              title="นำเข้าไฟล์ GeoJSON หลายไฟล์พร้อมกัน"
              style={{ cursor: 'pointer', pointerEvents: 'auto' }}
            >
              📁 นำเข้า GeoJSON
            </button>
            <button 
              className="btn-export" 
              onClick={handleExportGeoJSON}
              title="ส่งออกขอบเขตหมู่บ้านเป็นไฟล์ GeoJSON"
              style={{ cursor: 'pointer', pointerEvents: 'auto' }}
            >
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
                  <div className="save-form-header">
                    <h3>💾 บันทึกขอบเขตที่วาด</h3>
                    {/* Undo/Redo Controls */}
                    <div className="history-controls">
                      <button 
                        className="btn-history btn-undo"
                        onClick={handleUndo}
                        disabled={historyIndex <= 0}
                        title="Undo (Ctrl+Z)"
                      >
                        ↩️ Undo
                      </button>
                      <button 
                        className="btn-history btn-redo"
                        onClick={handleRedo}
                        disabled={historyIndex >= drawHistory.length - 1}
                        title="Redo (Ctrl+Y)"
                      >
                        ↪️ Redo
                      </button>
                      <span className="history-info" title="ขั้นตอนปัจจุบัน / ทั้งหมด">
                        {historyIndex + 1} / {drawHistory.length}
                      </span>
                    </div>
                  </div>
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
                  
                  {/* Action Buttons */}
                  <div className="drawing-actions">
                    {/* Clear and Cancel Buttons */}
                    <div className="action-buttons-row">
                      <button 
                        className="btn-clear"
                        onClick={handleClearDrawing}
                        title="ล้างการวาดและวาดใหม่"
                      >
                        🗑️ ล้างและวาดใหม่
                      </button>
                      <button 
                        className="btn-cancel-drawing"
                        onClick={handleCancelDrawing}
                        title="ยกเลิกการวาดทั้งหมด"
                      >
                        ❌ ยกเลิก
                      </button>
                    </div>
                    
                    {/* Save Button */}
                    <button className="btn-save-full" onClick={handleSaveDrawnBoundary}>
                      {editingBoundaryId ? '✏️ บันทึกการแก้ไข' : '💾 บันทึกขอบเขต'}
                    </button>
                    
                    {/* Cancel Edit Button (only when editing) */}
                    {editingBoundaryId && (
                      <button className="btn-cancel-edit" onClick={handleCancelEdit}>
                        🔙 ยกเลิกการแก้ไข
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
            <h2>📋 รายการขอบเขตที่บันทึกแล้ว ({(() => {
              const filtered = villageBoundaries.filter(b => 
                b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                b.villageNo.toString().includes(searchQuery)
              );
              return filtered.length;
            })()})</h2>
            <div className="list-controls">
              <input
                type="text"
                className="search-input"
                placeholder="🔍 ค้นหาหมู่บ้าน..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'no' | 'name' | 'status')}
              >
                <option value="no">เรียงตามหมู่</option>
                <option value="name">เรียงตามชื่อ</option>
                <option value="status">เรียงตามสถานะ</option>
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
                  {(() => {
                    // Filter boundaries based on search query
                    let filtered = villageBoundaries.filter(b => 
                      b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      b.villageNo.toString().includes(searchQuery)
                    );
                    
                    // Sort boundaries
                    filtered = filtered.sort((a, b) => {
                      if (sortBy === 'no') {
                        return a.villageNo - b.villageNo;
                      } else if (sortBy === 'name') {
                        return a.name.localeCompare(b.name, 'th');
                      } else if (sortBy === 'status') {
                        const aHasBoundary = a.boundary ? 1 : 0;
                        const bHasBoundary = b.boundary ? 1 : 0;
                        return bHasBoundary - aHasBoundary; // มีขอบเขตก่อน
                      }
                      return 0;
                    });
                    
                    return filtered;
                  })().map((boundary) => {
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
                        {boundary.centerPoint?.coordinates && boundary.centerPoint.coordinates.length >= 2 ? (
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
                              const loadingToast = toast.loading('กำลังลบขอบเขต...');
                              try {
                                await boundariesService.deleteVillageBoundary(boundary.id);
                                toast.dismiss(loadingToast);
                                toast.success(`ลบขอบเขต ${boundary.name} สำเร็จ`);
                                await loadBoundaries();
                              } catch (error: any) {
                                toast.dismiss(loadingToast);
                                console.error('Error deleting boundary:', error);
                                const errorMessage = error.response?.data?.message || error.message || 'เกิดข้อผิดพลาด';
                                toast.error(`ไม่สามารถลบขอบเขตได้: ${errorMessage}`);
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

        {/* Export Selection Modal */}
        {showExportModal && (
          <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
            <div className="modal-content export-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>📥 ส่งออกขอบเขตหมู่บ้าน</h2>
                <button className="modal-close" onClick={() => setShowExportModal(false)}>✕</button>
              </div>
              
              <div className="modal-body">
                <p className="modal-description">
                  เลือกหมู่บ้านที่ต้องการส่งออก หรือส่งออกทั้งหมด
                </p>
                
                <div className="selection-controls">
                  <button 
                    className="btn-select-all" 
                    onClick={selectAllVillages}
                  >
                    ✅ เลือกทั้งหมด
                  </button>
                  <button 
                    className="btn-deselect-all" 
                    onClick={deselectAllVillages}
                  >
                    ❌ ยกเลิกทั้งหมด
                  </button>
                  <span className="selection-count">
                    เลือกแล้ว: <strong>{selectedVillagesForExport.length}</strong> / {villageBoundaries.filter(v => v.boundary).length} หมู่
                  </span>
                </div>

                <div className="villages-selection-list">
                  {villageBoundaries
                    .filter(v => v.boundary)
                    .sort((a, b) => a.villageNo - b.villageNo)
                    .map((village) => {
                      const getVillageColor = (villageNo: number): string => {
                        const colors = [
                          '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
                          '#1abc9c', '#e67e22', '#34495e', '#16a085', '#c0392b',
                          '#27ae60', '#2980b9', '#8e44ad', '#f1c40f', '#d35400',
                          '#7f8c8d', '#e91e63', '#00bcd4', '#4caf50', '#ff5722',
                        ];
                        return colors[(villageNo - 1) % colors.length];
                      };
                      
                      const isSelected = selectedVillagesForExport.includes(village.id);
                      const color = getVillageColor(village.villageNo);
                      
                      return (
                        <div 
                          key={village.id} 
                          className={`village-selection-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleVillageSelection(village.id)}
                        >
                          <div className="village-checkbox">
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => {}}
                            />
                          </div>
                          <div 
                            className="village-color-indicator" 
                            style={{ backgroundColor: color }}
                          />
                          <div className="village-info">
                            <strong>หมู่ {village.villageNo}</strong>
                            <span>{village.name}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="btn-cancel" 
                  onClick={() => setShowExportModal(false)}
                >
                  ❌ ยกเลิก
                </button>
                <button 
                  className="btn-export-confirm" 
                  onClick={handleConfirmExport}
                  disabled={selectedVillagesForExport.length === 0}
                >
                  📥 ส่งออก {selectedVillagesForExport.length > 0 ? `(${selectedVillagesForExport.length} หมู่)` : 'ทั้งหมด'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Import Batch Modal */}
        {showImportModal && (
          <div className="modal-overlay" onClick={handleCloseImportModal}>
            <div className="modal-content import-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>📁 นำเข้า GeoJSON แบบ Batch</h2>
                <button className="modal-close" onClick={handleCloseImportModal}>✕</button>
              </div>
              
              <div className="modal-body">
                <p className="modal-description">
                  เลือกไฟล์ GeoJSON หลายไฟล์เพื่อนำเข้าพร้อมกัน
                </p>
                
                {/* File Input */}
                <div className="file-input-container">
                  <input
                    type="file"
                    id="batch-import-input"
                    multiple
                    accept=".json,.geojson"
                    onChange={(e) => handleFilesSelected(e.target.files)}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="batch-import-input" className="file-input-label">
                    📂 เลือกไฟล์ GeoJSON
                  </label>
                  {importFiles.length > 0 && (
                    <span className="file-count">
                      เลือกแล้ว: <strong>{importFiles.length}</strong> ไฟล์
                    </span>
                  )}
                </div>

                {/* Files List */}
                {importFiles.length > 0 && (
                  <div className="import-files-list">
                    {importFiles.map((file, index) => {
                      const result = importProgress.results.find(r => r.file === file.name);
                      const isProcessing = importProgress.status === 'processing' && index === importProgress.current - 1;
                      const isDone = result !== undefined;
                      
                      return (
                        <div 
                          key={index} 
                          className={`import-file-item ${isDone ? (result.status === 'success' ? 'success' : 'error') : ''} ${isProcessing ? 'processing' : ''}`}
                        >
                          <div className="file-icon">
                            {isDone ? (
                              result.status === 'success' ? '✅' : '❌'
                            ) : isProcessing ? (
                              '⏳'
                            ) : (
                              '📄'
                            )}
                          </div>
                          <div className="file-details">
                            <strong>{file.name}</strong>
                            <span className="file-size">
                              {(file.size / 1024).toFixed(2)} KB
                            </span>
                            {result && result.status === 'error' && (
                              <span className="error-message">{result.error}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Progress Bar */}
                {importProgress.status === 'processing' && (
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                      />
                    </div>
                    <span className="progress-text">
                      กำลังนำเข้า {importProgress.current} / {importProgress.total}
                    </span>
                  </div>
                )}

                {/* Results Summary */}
                {importProgress.status === 'completed' && importProgress.results.length > 0 && (
                  <div className="import-results">
                    <div className="result-item success-result">
                      ✅ สำเร็จ: {importProgress.results.filter(r => r.status === 'success').length} ไฟล์
                    </div>
                    {importProgress.results.filter(r => r.status === 'error').length > 0 && (
                      <div className="result-item error-result">
                        ❌ ล้มเหลว: {importProgress.results.filter(r => r.status === 'error').length} ไฟล์
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button 
                  className="btn-cancel" 
                  onClick={handleCloseImportModal}
                  disabled={importProgress.status === 'processing'}
                >
                  {importProgress.status === 'completed' ? '✅ ปิด' : '❌ ยกเลิก'}
                </button>
                {importProgress.status !== 'completed' && (
                  <button 
                    className="btn-import-confirm" 
                    onClick={handleBatchImport}
                    disabled={importFiles.length === 0 || importProgress.status === 'processing'}
                  >
                    {importProgress.status === 'processing' ? (
                      <>⏳ กำลังนำเข้า...</>
                    ) : (
                      <>📁 นำเข้าทั้งหมด ({importFiles.length} ไฟล์)</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
