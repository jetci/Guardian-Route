import { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/leaflet.css';
import { type SurveyData } from '../../../../types/survey';
import { TAMBON_INFO } from '../../../../data/villages';
import { villagesApi } from '../../../../api/villages';
import toast from 'react-hot-toast';
import { MapPin, Calendar, AlertTriangle, Info, ImagePlus, X } from 'lucide-react';

interface Props {
    data: SurveyData;
    updateData: (data: Partial<SurveyData>) => void;
}

export default function Step1_IncidentInfo({ data, updateData }: Props) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
    const [villages, setVillages] = useState<any[]>([]);

    // Load Villages for boundary display
    useEffect(() => {
        const loadVillages = async () => {
            try {
                const v = await villagesApi.getAllForMap();
                setVillages(v);
            } catch (err) {
                console.error('Failed to load villages', err);
            }
        };
        loadVillages();
    }, []);

    // Initialize Map
    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current).setView([TAMBON_INFO.centerLat, TAMBON_INFO.centerLng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
        }).addTo(map);

        const drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);
        drawnItemsRef.current = drawnItems;

        // Add Fullscreen control
        const fullscreenControl = new L.Control({ position: 'topleft' });
        (fullscreenControl as any).onAdd = function () {
            const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
            div.innerHTML = `
                <a href="#" class="leaflet-control-fullscreen" title="Toggle Fullscreen" role="button" aria-label="Toggle Fullscreen" style="display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; background: white; cursor: pointer;">
                  <span style="font-size: 18px; line-height: 1;">⛶</span>
                </a>
              `;
            div.onclick = function (e: any) {
                e.preventDefault();
                e.stopPropagation();
                const mapContainer = mapRef.current;
                if (mapContainer) {
                    if (!document.fullscreenElement) {
                        mapContainer.requestFullscreen().then(() => {
                            setTimeout(() => map.invalidateSize(), 100);
                        }).catch(err => console.error('Error attempting to enable fullscreen:', err));
                    } else {
                        document.exitFullscreen().then(() => {
                            setTimeout(() => map.invalidateSize(), 100);
                        });
                    }
                }
            };
            return div;
        };
        fullscreenControl.addTo(map);

        // Add Cancel Draw Mode Button
        const CancelDrawControl = L.Control.extend({
            onAdd: function () {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control cancel-draw-control');
                const button = L.DomUtil.create('button', 'cancel-draw-btn', container);
                button.innerHTML = `
            <span style="font-size: 20px;">❌</span>
            <span style="font-size: 14px; font-weight: 500;">ยกเลิก</span>
          `;
                button.title = 'ยกเลิกการวาด (กด ESC)';
                button.style.cssText = `
            background: #ef4444; color: white; border: none; padding: 10px 16px;
            cursor: pointer; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            font-family: 'Sarabun', sans-serif; display: none; align-items: center;
            gap: 6px; font-weight: 500;
          `;
                L.DomEvent.on(button, 'click', function (e) {
                    L.DomEvent.preventDefault(e);
                    L.DomEvent.stopPropagation(e);
                    map.pm.disableDraw();
                    button.style.display = 'none';
                    toast('ยกเลิกการวาด', { icon: 'ℹ️' });
                });

                map.on('pm:drawstart', () => { button.style.display = 'flex'; });
                map.on('pm:drawend', () => { button.style.display = 'none'; });
                map.on('pm:globaldrawmodetoggled', (e: any) => { if (!e.enabled) button.style.display = 'none'; });
                return container;
            }
        });
        map.addControl(new CancelDrawControl({ position: 'topright' }));

        // Add Geoman controls
        map.pm.addControls({
            position: 'topleft',
            drawCircle: false, drawCircleMarker: false, drawPolyline: false,
            drawRectangle: true, drawPolygon: true, drawMarker: true,
            editMode: true, dragMode: true, cutPolygon: true,
            removalMode: true, rotateMode: true,
        });
        map.pm.setGlobalOptions({ layerGroup: drawnItems });

        // Handle Draw Events
        map.on('pm:create', (e: any) => {
            const layer = e.layer;
            if (layer instanceof L.Marker) {
                const { lat, lng } = layer.getLatLng();
                updateData({ gpsLocation: { lat, lng } });
                map.eachLayer((l: any) => {
                    if (l instanceof L.Marker && l !== layer) map.removeLayer(l);
                });
            }
            if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
                const geojson = layer.toGeoJSON();
                updateData({ polygon: geojson });
            }
        });

        map.on('pm:remove', (e: any) => {
            if (e.layer instanceof L.Marker) updateData({ gpsLocation: null });
            if (e.layer instanceof L.Polygon) updateData({ polygon: null });
        });

        mapInstanceRef.current = map;

        // Force map update after render to fix grey area issue
        setTimeout(() => {
            map.invalidateSize();
        }, 100);

        // Another update just in case with transition
        setTimeout(() => {
            map.invalidateSize();
        }, 500);

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // Sync Data to Map
    useEffect(() => {
        const map = mapInstanceRef.current;
        const drawnItems = drawnItemsRef.current;
        if (!map || !drawnItems) return;

        drawnItems.clearLayers();
        if (data.gpsLocation) {
            L.marker([data.gpsLocation.lat, data.gpsLocation.lng]).addTo(drawnItems);
            map.setView([data.gpsLocation.lat, data.gpsLocation.lng], 15);
        }
        if (data.polygon) {
            L.geoJSON(data.polygon).eachLayer((l: any) => l.addTo(drawnItems));
        }
    }, [data.gpsLocation, data.polygon]);

    // Display Village Boundary
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !data.villageId || villages.length === 0) return;

        const village = villages.find(v => v.id.toString() === data.villageId);
        if (village && village.boundary) {
            map.eachLayer((l: any) => {
                if (l.options?.className === 'village-boundary') map.removeLayer(l);
            });
            const boundaryLayer = L.geoJSON({
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [village.boundary.map((c: any) => [c[1], c[0]])]
                }
            } as any, {
                style: { color: 'orange', fillOpacity: 0.1, weight: 2, dashArray: '5,5' },
                className: 'village-boundary', interactive: false
            } as any).addTo(map);

            if (!data.gpsLocation && !data.polygon) {
                map.fitBounds(boundaryLayer.getBounds());
            }
        }
    }, [data.villageId, villages]);

    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                updateData({ gpsLocation: { lat: latitude, lng: longitude } });
                mapInstanceRef.current?.setView([latitude, longitude], 16);
                toast.success('ระบุตำแหน่งเรียบร้อย');
            },
            () => toast.error('ไม่สามารถระบุตำแหน่งได้')
        );
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newUrls = files.map(f => URL.createObjectURL(f));
            updateData({ photoUrls: [...data.photoUrls, ...newUrls] });
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Sarabun', sans-serif" }}>
            {/* Read-only Info */}
            <div style={{
                background: '#eff6ff',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #dbeafe',
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.05)'
            }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e40af', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Info size={18} /> ข้อมูลภารกิจ
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <div style={{ background: 'white', padding: '12px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                        <span style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '4px' }}>หมู่บ้าน</span>
                        <span style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>{data.villageName || '-'}</span>
                    </div>
                    <div style={{ background: 'white', padding: '12px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                        <span style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '4px' }}>ประเภทภัย</span>
                        <span style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>{data.disasterType || '-'}</span>
                    </div>
                    <div style={{ gridColumn: '1 / -1', background: 'white', padding: '12px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                        <span style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '4px' }}>วันที่สำรวจ</span>
                        <span style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>{new Date(data.surveyDate).toLocaleDateString('th-TH')}</span>
                    </div>
                </div>
            </div>

            {/* Map */}
            <div>
                <label style={{ display: 'block', fontSize: '15px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>
                    ระบุพิกัด/ขอบเขตพื้นที่ <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{
                    position: 'relative', height: '600px', borderRadius: '20px', overflow: 'hidden',
                    border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}>
                    <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
                    <button
                        onClick={getCurrentLocation}
                        style={{
                            position: 'absolute', top: '16px', right: '16px', zIndex: 400,
                            background: 'white', padding: '10px 14px', borderRadius: '12px',
                            border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer',
                            color: '#2563eb', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px',
                            transition: 'transform 0.1s'
                        }}
                    >
                        <MapPin size={16} /> พิกัดฉัน
                    </button>
                    <div style={{
                        position: 'absolute', bottom: '16px', left: '16px', zIndex: 400,
                        background: 'rgba(255,255,255,0.9)', padding: '8px 12px', borderRadius: '8px',
                        fontSize: '12px', color: '#475569', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.5)'
                    }}>
                        ใช้เครื่องมือทางซ้ายบนเพื่อปักหมุดหรือวาดพื้นที่
                    </div>
                </div>
            </div>

            {/* Photos */}
            <div>
                <label style={{ display: 'block', fontSize: '15px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>
                    รูปถ่ายสถานการณ์
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
                    {data.photoUrls.map((url, idx) => (
                        <div key={idx} style={{
                            position: 'relative', aspectRatio: '1/1', borderRadius: '16px', overflow: 'hidden',
                            border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}>
                            <img src={url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                                onClick={() => {
                                    const newUrls = data.photoUrls.filter((_, i) => i !== idx);
                                    updateData({ photoUrls: newUrls });
                                }}
                                style={{
                                    position: 'absolute', top: '4px', right: '4px',
                                    background: 'rgba(239, 68, 68, 0.9)', color: 'white',
                                    borderRadius: '50%', width: '24px', height: '24px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: 'none', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                    <label style={{
                        aspectRatio: '1/1', borderRadius: '16px',
                        border: '2px dashed #cbd5e1',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', background: '#f8fafc', color: '#94a3b8',
                        transition: 'all 0.2s'
                    }}>
                        <ImagePlus size={24} style={{ marginBottom: '4px' }} />
                        <span style={{ fontSize: '12px', fontWeight: '600' }}>เพิ่มรูป</span>
                        <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                    </label>
                </div>
            </div>
        </div>
    );
}
