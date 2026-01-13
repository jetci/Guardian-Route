import { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/leaflet.css';
import { type SurveyData } from '../../../../types/survey';
import { TAMBON_INFO } from '../../../../data/villages';
import { villagesApi } from '../../../../api/villages';
import toast from 'react-hot-toast';

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
                        }).catch(err => {
                            console.error('Error attempting to enable fullscreen:', err);
                        });
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
            background: #ef4444;
            color: white;
            border: none;
            padding: 10px 16px;
            cursor: pointer;
            border-radius: 4px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            font-family: 'Sarabun', sans-serif;
            display: none;
            align-items: center;
            gap: 6px;
            font-weight: 500;
          `;

                L.DomEvent.on(button, 'click', function (e) {
                    L.DomEvent.preventDefault(e);
                    L.DomEvent.stopPropagation(e);

                    console.log('🔴 Cancel button clicked');
                    map.pm.disableDraw();
                    button.style.display = 'none';
                    toast('ยกเลิกการวาด', { icon: 'ℹ️' });
                });

                // Show/hide button based on draw mode
                map.on('pm:drawstart', () => {
                    button.style.display = 'flex';
                });

                map.on('pm:drawend', () => {
                    button.style.display = 'none';
                });

                // Also hide when draw mode is disabled
                map.on('pm:globaldrawmodetoggled', (e: any) => {
                    if (!e.enabled) {
                        button.style.display = 'none';
                    }
                });

                return container;
            }
        });

        map.addControl(new CancelDrawControl({ position: 'topright' }));

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
            cutPolygon: true,
            removalMode: true,
            rotateMode: true,
        });

        map.pm.setGlobalOptions({ layerGroup: drawnItems });

        // Handle Draw Events
        map.on('pm:create', (e: any) => {
            const layer = e.layer;

            // If Marker (GPS Location)
            if (layer instanceof L.Marker) {
                const { lat, lng } = layer.getLatLng();
                updateData({ gpsLocation: { lat, lng } });

                // Remove other markers (single point only for now, or keep multiple if needed)
                // For this requirement, let's assume one main location, but we can support multiple if needed.
                // If we want single marker:
                map.eachLayer((l: any) => {
                    if (l instanceof L.Marker && l !== layer) {
                        map.removeLayer(l);
                    }
                });
            }

            // If Polygon (Area)
            if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
                const geojson = layer.toGeoJSON();
                updateData({ polygon: geojson });
            }
        });

        map.on('pm:remove', (e: any) => {
            // Clear data if removed
            // This is tricky if multiple layers. For now, simple logic.
            if (e.layer instanceof L.Marker) {
                updateData({ gpsLocation: null });
            }
            if (e.layer instanceof L.Polygon) {
                updateData({ polygon: null });
            }
        });

        mapInstanceRef.current = map;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // Sync Data to Map (if returning to step)
    useEffect(() => {
        const map = mapInstanceRef.current;
        const drawnItems = drawnItemsRef.current;
        if (!map || !drawnItems) return;

        // Clear existing to avoid dupes
        drawnItems.clearLayers();

        if (data.gpsLocation) {
            L.marker([data.gpsLocation.lat, data.gpsLocation.lng]).addTo(drawnItems);
            map.setView([data.gpsLocation.lat, data.gpsLocation.lng], 15);
        }

        if (data.polygon) {
            L.geoJSON(data.polygon).eachLayer((l: any) => {
                l.addTo(drawnItems);
            });
        }
    }, [data.gpsLocation, data.polygon]); // Only run if these change externally or on mount

    // Display Village Boundary
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !data.villageId || villages.length === 0) return;

        const village = villages.find(v => v.id.toString() === data.villageId);
        if (village && village.boundary) {
            // Remove old boundary
            map.eachLayer((l: any) => {
                if (l.options?.className === 'village-boundary') {
                    map.removeLayer(l);
                }
            });

            // Add new boundary
            const boundaryLayer = L.geoJSON({
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [village.boundary.map((c: any) => [c[1], c[0]])] // Swap lat/lng if needed
                }
            } as any, {
                style: { color: 'orange', fillOpacity: 0.1, weight: 2, dashArray: '5,5' },
                className: 'village-boundary',
                interactive: false
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
            // In a real app, upload immediately or store File objects. 
            // For now, let's assume we store object URLs for preview and upload later, 
            // OR we reuse the logic from SurveyAreaPage to upload immediately.
            // Let's store object URLs for now to keep it simple in UI, but we need to handle upload in Step 8 or here.
            // Better to upload here if possible, or store File[] in SurveyData (need to update type).
            // For this demo, let's just show previews.
            const newUrls = files.map(f => URL.createObjectURL(f));
            updateData({ photoUrls: [...data.photoUrls, ...newUrls] });
        }
    };

    return (
        <div className="space-y-6">
            {/* Read-only Info */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h3 className="font-bold text-blue-800 mb-2">ข้อมูลงาน</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-500 block">หมู่บ้าน</span>
                        <span className="font-medium">{data.villageName}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 block">ประเภทภัย</span>
                        <span className="font-medium">{data.disasterType}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 block">วันที่สำรวจ</span>
                        <span className="font-medium">{new Date(data.surveyDate).toLocaleDateString('th-TH')}</span>
                    </div>
                </div>
            </div>

            {/* Map */}
            <div className="space-y-2">
                <label className="font-bold text-gray-700">ระบุพิกัด/ขอบเขตพื้นที่ *</label>
                <div className="relative h-[400px] rounded-xl overflow-hidden border border-gray-300">
                    <div ref={mapRef} className="w-full h-full" />
                    <button
                        onClick={getCurrentLocation}
                        className="absolute top-4 right-4 z-[400] bg-white p-3 rounded-full shadow-lg text-blue-600 hover:bg-blue-50"
                        title="ตำแหน่งปัจจุบัน"
                    >
                        📍
                    </button>
                </div>
                <p className="text-xs text-gray-500">
                    ใช้เครื่องมือทางซ้ายบนของแผนที่เพื่อปักหมุด (Marker) หรือวาดขอบเขต (Polygon)
                </p>
            </div>

            {/* Photos */}
            <div className="space-y-2">
                <label className="font-bold text-gray-700">รูปถ่ายสถานการณ์</label>
                <div className="grid grid-cols-4 gap-2">
                    {data.photoUrls.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                            <img src={url} alt="preview" className="w-full h-full object-cover" />
                            <button
                                onClick={() => {
                                    const newUrls = data.photoUrls.filter((_, i) => i !== idx);
                                    updateData({ photoUrls: newUrls });
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50">
                        <span className="text-2xl">+</span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    </label>
                </div>
            </div>
        </div>
    );
}
