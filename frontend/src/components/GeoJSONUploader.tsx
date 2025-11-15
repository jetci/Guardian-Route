import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import './GeoJSONUploader.css';

interface GeoJSONUploaderProps {
  onUpload: (geojson: any, filename: string) => void;
}

export default function GeoJSONUploader({ onUpload }: GeoJSONUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateGeoJSON = (data: any): boolean => {
    if (!data || typeof data !== 'object') return false;
    if (!data.type) return false;
    
    const validTypes = ['Feature', 'FeatureCollection', 'Polygon', 'MultiPolygon', 'Point', 'LineString'];
    return validTypes.includes(data.type);
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.json') && !file.name.endsWith('.geojson')) {
      toast.error('กรุณาอัปโหลดไฟล์ .json หรือ .geojson เท่านั้น');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const geojson = JSON.parse(content);

        if (!validateGeoJSON(geojson)) {
          toast.error('ไฟล์ GeoJSON ไม่ถูกต้อง');
          return;
        }

        toast.success(`อัปโหลด ${file.name} สำเร็จ`);
        onUpload(geojson, file.name);
      } catch (error) {
        toast.error('ไม่สามารถอ่านไฟล์ได้ กรุณาตรวจสอบรูปแบบ JSON');
      }
    };

    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="geojson-uploader">
      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.geojson"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <div className="upload-icon">📁</div>
        <h3>อัปโหลดไฟล์ GeoJSON</h3>
        <p>ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
        <p className="file-info">รองรับไฟล์: .json, .geojson</p>
      </div>
    </div>
  );
}
