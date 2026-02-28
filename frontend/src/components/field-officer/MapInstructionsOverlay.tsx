/**
 * Map Instructions Overlay Component
 * Provides user guidance for map and drawing tools
 */

import { useState } from 'react';
import './MapInstructionsOverlay.css';

interface MapInstructionsOverlayProps {
    onClose: () => void;
}

export function MapInstructionsOverlay({ onClose }: MapInstructionsOverlayProps) {
    return (
        <div className="map-instructions-overlay">
            <div className="map-instructions-content">
                <div className="instructions-header">
                    <h3>📍 วิธีใช้งานแผนที่</h3>
                    <button className="close-button" onClick={onClose} aria-label="Close">
                        ✕
                    </button>
                </div>

                <div className="instructions-body">
                    <div className="instruction-step">
                        <span className="step-number">1</span>
                        <div className="step-content">
                            <strong>เลือกหมู่บ้าน</strong>
                            <p>เลือกหมู่บ้านจาก dropdown หรือคลิกบนแผนที่</p>
                        </div>
                    </div>

                    <div className="instruction-step">
                        <span className="step-number">2</span>
                        <div className="step-content">
                            <strong>ระบุตำแหน่ง GPS</strong>
                            <p>คลิกปุ่ม "📍 Get Location" หรือ "📌 Manual Pin"</p>
                        </div>
                    </div>

                    <div className="instruction-step">
                        <span className="step-number">3</span>
                        <div className="step-content">
                            <strong>วาดขอบเขตพื้นที่</strong>
                            <p>ใช้เครื่องมือด้านซ้ายบนของแผนที่:</p>
                            <ul>
                                <li>🔷 <strong>Polygon</strong> - วาดรูปหลายเหลี่ยม (คลิกจุดต่างๆ แล้วปิดรูป)</li>
                                <li>⬜ <strong>Rectangle</strong> - วาดสี่เหลี่ยม</li>
                                <li>✏️ <strong>Edit</strong> - แก้ไขพื้นที่ที่วาดแล้ว</li>
                                <li>🗑️ <strong>Delete</strong> - ลบพื้นที่</li>
                            </ul>
                        </div>
                    </div>

                    <div className="instruction-step">
                        <span className="step-number">4</span>
                        <div className="step-content">
                            <strong>กรอกข้อมูลและส่ง</strong>
                            <p>กรอกรายละเอียดด้านล่างแผนที่แล้วคลิก "บันทึกและตรวจสอบ"</p>
                        </div>
                    </div>
                </div>

                <div className="instructions-footer">
                    <div className="tips-box">
                        <strong>💡 เคล็ดลับ:</strong>
                        <ul>
                            <li>ใช้ปุ่ม Satellite/Street เพื่อสลับมุมมองแผนที่</li>
                            <li>ใช้ปุ่ม ⛶ เพื่อเข้าโหมดเต็มจอ</li>
                            <li>สามารถซูมแผนที่ด้วยล้อเมาส์หรือนิ้ว 2 นิ้ว</li>
                        </ul>
                    </div>
                    <button className="got-it-button" onClick={onClose}>
                        ✅ เข้าใจแล้ว
                    </button>
                </div>
            </div>
        </div>
    );
}
