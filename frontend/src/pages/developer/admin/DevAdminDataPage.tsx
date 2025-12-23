import { useState, useCallback } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { MapContainer, TileLayer, GeoJSON as LeafletGeoJSON } from 'react-leaflet';
import { geojsonApi, GeoJsonType, type GeoJsonValidationResult } from '../../../api/geojson';
import toast from 'react-hot-toast';
import './DevAdminDataPage.css';
import 'leaflet/dist/leaflet.css';

/**
 * Admin Data Management Page
 * Upload and manage GeoJSON with validation and preview
 */
export default function DevAdminDataPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dataType, setDataType] = useState<GeoJsonType>(GeoJsonType.VILLAGE_BOUNDARY);
    const [description, setDescription] = useState('');
    const [validating, setValidating] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [validation, setValidation] = useState<GeoJsonValidationResult | null>(null);
    const [previewData, setPreviewData] = useState<any>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileSelect = (file: File) => {
        if (!file.name.endsWith('.json') && !file.name.endsWith('.geojson')) {
            toast.error('กรุณาเลือกไฟล์ .json หรือ .geojson');
            return;
        }

        setSelectedFile(file);
        setValidation(null);
        setPreviewData(null);
        toast.success(`เลือกไฟล์: ${file.name}`);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleValidate = async () => {
        if (!selectedFile) {
            toast.error('กรุณาเลือกไฟล์ก่อน');
            return;
        }

        setValidating(true);
        try {
            const result = await geojsonApi.validateGeoJson(selectedFile, dataType);
            setValidation(result.validation);
            setPreviewData(result.preview);

            if (result.validation.valid) {
                toast.success(`✅ ตรวจสอบผ่าน! พบ ${result.validation.features} features`);
            } else {
                toast.error(`❌ ตรวจสอบไม่ผ่าน: ${result.validation.errors.length} ข้อผิดพลาด`);
            }
        } catch (error: any) {
            toast.error('เกิดข้อผิดพลาด: ' + (error.response?.data?.message || error.message));
        } finally {
            setValidating(false);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !validation?.valid) {
            toast.error('กรุณาตรวจสอบไฟล์ให้ผ่านก่อนอัปโหลด');
            return;
        }

        setUploading(true);
        try {
            const result = await geojsonApi.uploadGeoJson(selectedFile, dataType, description);
            toast.success(`🎉 อัปโหลดสำเร็จ! บันทึก ${result.savedCount} รายการ`);
            
            // Reset form
            setSelectedFile(null);
            setValidation(null);
            setPreviewData(null);
            setDescription('');
        } catch (error: any) {
            toast.error('เกิดข้อผิดพลาด: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setValidation(null);
        setPreviewData(null);
        setDescription('');
        toast('🔄 รีเซ็ตแล้ว', { icon: 'ℹ️' });
    };

    return (
        <DashboardLayout>
            <div className="admin-data-page">
                {/* Header */}
                <header className="data-header">
                    <div className="header-content">
                        <h1>📦 จัดการข้อมูล GeoJSON</h1>
                        <p className="subtitle">อัปโหลดและจัดการไฟล์ GeoJSON พร้อมตรวจสอบความถูกต้อง</p>
                    </div>
                </header>

                <div className="data-content">
                    {/* Upload Section */}
                    <div className="upload-section">
                        <h2 className="section-title">📤 อัปโหลดไฟล์</h2>
                        
                        {/* Dropzone */}
                        <div
                            className={`dropzone ${dragActive ? 'active' : ''} ${selectedFile ? 'has-file' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('fileInput')?.click()}
                        >
                            <input
                                id="fileInput"
                                type="file"
                                accept=".json,.geojson"
                                onChange={handleFileInput}
                                style={{ display: 'none' }}
                            />
                            {selectedFile ? (
                                <div className="file-selected">
                                    <div className="file-icon">📄</div>
                                    <div className="file-info">
                                        <h3>{selectedFile.name}</h3>
                                        <p>{(selectedFile.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                    <button
                                        className="btn-remove"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleReset();
                                        }}
                                    >
                                        ❌
                                    </button>
                                </div>
                            ) : (
                                <div className="dropzone-content">
                                    <div className="dropzone-icon">📁</div>
                                    <h3>ลากไฟล์มาวางที่นี่</h3>
                                    <p>หรือคลิกเพื่อเลือกไฟล์</p>
                                    <span className="file-types">รองรับ: .json, .geojson</span>
                                </div>
                            )}
                        </div>

                        {/* Data Type Selection */}
                        <div className="form-group">
                            <label htmlFor="dataType">🏷️ ประเภทข้อมูล</label>
                            <select
                                id="dataType"
                                value={dataType}
                                onChange={(e) => setDataType(e.target.value as GeoJsonType)}
                                className="form-select"
                            >
                                <option value={GeoJsonType.VILLAGE_BOUNDARY}>ขอบเขตหมู่บ้าน</option>
                                <option value={GeoJsonType.DISTRICT_BOUNDARY}>ขอบเขตตำบล</option>
                                <option value={GeoJsonType.RISK_ZONE}>พื้นที่เสี่ยงภัย</option>
                                <option value={GeoJsonType.INFRASTRUCTURE}>โครงสร้างพื้นฐาน</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label htmlFor="description">📝 คำอธิบาย (ไม่บังคับ)</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="form-textarea"
                                placeholder="เพิ่มคำอธิบายเกี่ยวกับข้อมูลนี้..."
                                rows={3}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button
                                className="btn-validate"
                                onClick={handleValidate}
                                disabled={!selectedFile || validating}
                            >
                                {validating ? '⏳ กำลังตรวจสอบ...' : '🔍 ตรวจสอบไฟล์'}
                            </button>
                            <button
                                className="btn-upload"
                                onClick={handleUpload}
                                disabled={!validation?.valid || uploading}
                            >
                                {uploading ? '⏳ กำลังอัปโหลด...' : '📤 อัปโหลด'}
                            </button>
                            <button
                                className="btn-reset"
                                onClick={handleReset}
                                disabled={!selectedFile}
                            >
                                🔄 รีเซ็ต
                            </button>
                        </div>
                    </div>

                    {/* Validation Results */}
                    {validation && (
                        <div className="validation-section">
                            <h2 className="section-title">
                                {validation.valid ? '✅ ผลการตรวจสอบ' : '❌ ผลการตรวจสอบ'}
                            </h2>
                            
                            <div className={`validation-card ${validation.valid ? 'valid' : 'invalid'}`}>
                                <div className="validation-summary">
                                    <div className="summary-item">
                                        <span className="label">Features:</span>
                                        <span className="value">{validation.features}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="label">Geometry Types:</span>
                                        <span className="value">{validation.geometryTypes.join(', ')}</span>
                                    </div>
                                    {validation.properties && validation.properties.length > 0 && (
                                        <div className="summary-item">
                                            <span className="label">Properties:</span>
                                            <span className="value">{validation.properties.join(', ')}</span>
                                        </div>
                                    )}
                                </div>

                                {validation.errors.length > 0 && (
                                    <div className="validation-errors">
                                        <h3>❌ ข้อผิดพลาด ({validation.errors.length})</h3>
                                        <ul>
                                            {validation.errors.map((error, index) => (
                                                <li key={index}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {validation.warnings.length > 0 && (
                                    <div className="validation-warnings">
                                        <h3>⚠️ คำเตือน ({validation.warnings.length})</h3>
                                        <ul>
                                            {validation.warnings.map((warning, index) => (
                                                <li key={index}>{warning}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {validation.bounds && (
                                    <div className="validation-bounds">
                                        <h3>🗺️ ขอบเขตพื้นที่</h3>
                                        <div className="bounds-grid">
                                            <div>Min Lat: {validation.bounds.minLat.toFixed(6)}</div>
                                            <div>Max Lat: {validation.bounds.maxLat.toFixed(6)}</div>
                                            <div>Min Lng: {validation.bounds.minLng.toFixed(6)}</div>
                                            <div>Max Lng: {validation.bounds.maxLng.toFixed(6)}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Map Preview */}
                    {previewData && validation?.bounds && (
                        <div className="preview-section">
                            <h2 className="section-title">🗺️ ตัวอย่างแผนที่</h2>
                            <div className="map-container">
                                <MapContainer
                                    center={[
                                        (validation.bounds.minLat + validation.bounds.maxLat) / 2,
                                        (validation.bounds.minLng + validation.bounds.maxLng) / 2
                                    ]}
                                    zoom={13}
                                    style={{ height: '500px', width: '100%' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    />
                                    <LeafletGeoJSON
                                        data={previewData}
                                        style={() => ({
                                            color: '#3182ce',
                                            weight: 2,
                                            fillColor: '#3182ce',
                                            fillOpacity: 0.2
                                        })}
                                    />
                                </MapContainer>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
