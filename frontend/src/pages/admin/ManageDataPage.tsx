/**
 * Manage Data Page - Admin
 * จัดการข้อมูล GeoJSON และข้อมูลหลักของระบบ
 */

import { useState, useRef } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import { StatCard } from '../../components/common/StatCard';
import './ManageDataPage.css';

export default function ManageDataPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = async (files: FileList) => {
    const file = files[0];

    // Validate file type
    if (!file.name.endsWith('.geojson') && !file.name.endsWith('.json')) {
      toast.error('กรุณาเลือกไฟล์ .geojson หรือ .json เท่านั้น');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('ไฟล์มีขนาดใหญ่เกิน 10MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Read and validate GeoJSON
      const text = await file.text();
      const geojson = JSON.parse(text);

      if (!geojson.type || !geojson.features) {
        throw new Error('ไฟล์ไม่ใช่ GeoJSON ที่ถูกต้อง');
      }

      // TODO: Upload to server
      // await uploadGeoJSON(geojson);

      setUploadProgress(100);
      setTimeout(() => {
        toast.success(`อัปโหลดไฟล์ ${file.name} สำเร็จ!`);
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error: any) {
      clearInterval(interval);
      toast.error(error.message || 'เกิดข้อผิดพลาดในการอัปโหลด');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = (dataType: string) => {
    toast.success(`กำลังดาวน์โหลด ${dataType}...`);
    // TODO: Implement download
  };

  const handleDelete = (dataType: string) => {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบ ${dataType}?`)) {
      toast.success(`ลบ ${dataType} สำเร็จ`);
      // TODO: Implement delete
    }
  };

  return (
    <DashboardLayout>
      <div className="manage-data-page">
        <div className="page-header">
          <div className="header-content">
            <h1>💾 จัดการข้อมูล</h1>
            <p className="subtitle">อัปโหลดและจัดการข้อมูล GeoJSON สำหรับขอบเขตหมู่บ้านและพื้นที่เสี่ยงภัย</p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <StatCard
            title="หมู่บ้าน"
            value={20}
            icon="🗺️"
            color="blue"
          />
          <StatCard
            title="ขอบเขต GeoJSON"
            value={20}
            icon="📍"
            color="purple"
          />
          <StatCard
            title="พื้นที่เสี่ยงภัย"
            value={5}
            icon="⚠️"
            color="orange"
          />
          <StatCard
            title="อัปเดตล่าสุด"
            value="วันนี้"
            icon="🕐"
            color="green"
          />
        </div>

        {/* Upload Section */}
        <div className="content-card">
          <h2>📤 อัปโหลด GeoJSON</h2>
          <div className="upload-section">
            <div
              className={`upload-box ${dragOver ? 'drag-over' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="upload-icon">📁</div>
              <p><strong>ลากไฟล์มาวางที่นี่</strong> หรือคลิกเพื่อเลือกไฟล์</p>
              <p className="upload-hint">รองรับ: .geojson, .json (ขนาดไม่เกิน 10MB)</p>
              <button className="btn-primary" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                📂 เลือกไฟล์
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="file-input"
                accept=".geojson,.json"
                onChange={handleFileSelect}
              />
            </div>

            {uploading && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="progress-text">กำลังอัปโหลด... {uploadProgress}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Data List */}
        <div className="content-card">
          <h2>📋 ข้อมูลที่มีอยู่ในระบบ</h2>
          <div className="data-list">
            <div className="data-item">
              <span className="data-icon">🗺️</span>
              <div className="data-info">
                <h3>ขอบเขตหมู่บ้าน (20 หมู่บ้าน)</h3>
                <p>📅 อัปเดตล่าสุด: 17 พ.ย. 2567 | 📦 ขนาด: 2.5 MB</p>
              </div>
              <div className="data-actions">
                <button className="btn-success" onClick={() => handleDownload('ขอบเขตหมู่บ้าน')}>
                  ⬇️ ดาวน์โหลด
                </button>
                <button className="btn-secondary">
                  👁️ ดูบนแผนที่
                </button>
                <button className="btn-danger" onClick={() => handleDelete('ขอบเขตหมู่บ้าน')}>
                  🗑️ ลบ
                </button>
              </div>
            </div>

            <div className="data-item">
              <span className="data-icon">⚠️</span>
              <div className="data-info">
                <h3>พื้นที่เสี่ยงภัยน้ำท่วม</h3>
                <p>📅 อัปเดตล่าสุด: 15 พ.ย. 2567 | 📦 ขนาด: 1.2 MB</p>
              </div>
              <div className="data-actions">
                <button className="btn-success" onClick={() => handleDownload('พื้นที่เสี่ยงภัยน้ำท่วม')}>
                  ⬇️ ดาวน์โหลด
                </button>
                <button className="btn-secondary">
                  👁️ ดูบนแผนที่
                </button>
                <button className="btn-danger" onClick={() => handleDelete('พื้นที่เสี่ยงภัยน้ำท่วม')}>
                  🗑️ ลบ
                </button>
              </div>
            </div>

            <div className="data-item">
              <span className="data-icon">🔥</span>
              <div className="data-info">
                <h3>พื้นที่เสี่ยงภัยไฟป่า</h3>
                <p>📅 อัปเดตล่าสุด: 10 พ.ย. 2567 | 📦 ขนาด: 850 KB</p>
              </div>
              <div className="data-actions">
                <button className="btn-success" onClick={() => handleDownload('พื้นที่เสี่ยงภัยไฟป่า')}>
                  ⬇️ ดาวน์โหลด
                </button>
                <button className="btn-secondary">
                  👁️ ดูบนแผนที่
                </button>
                <button className="btn-danger" onClick={() => handleDelete('พื้นที่เสี่ยงภัยไฟป่า')}>
                  🗑️ ลบ
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="content-card">
          <h2>⚡ การดำเนินการด่วน</h2>
          <div className="action-grid">
            <div className="action-card">
              <div className="action-icon">📥</div>
              <h3>Import ข้อมูล</h3>
              <p>นำเข้าข้อมูลจากไฟล์ CSV หรือ Excel</p>
            </div>
            <div className="action-card">
              <div className="action-icon">📤</div>
              <h3>Export ข้อมูล</h3>
              <p>ส่งออกข้อมูลทั้งหมดเป็นไฟล์</p>
            </div>
            <div className="action-card">
              <div className="action-icon">🔄</div>
              <h3>Sync ข้อมูล</h3>
              <p>ซิงค์ข้อมูลกับระบบภายนอก</p>
            </div>
            <div className="action-card">
              <div className="action-icon">🗄️</div>
              <h3>Backup</h3>
              <p>สำรองข้อมูลทั้งหมด</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
