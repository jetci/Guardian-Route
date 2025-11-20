import React, { useState, useEffect } from 'react';
import type { User } from '../../types';

interface UserModalProps {
    user: User | null;
    onSave: (data: any) => void;
    onClose: () => void;
    isDeveloper: boolean;
}

export function UserModal({ user, onSave, onClose, isDeveloper }: UserModalProps) {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        firstName: '',
        lastName: '',
        phone: '',
        department: '',
        password: '',
        role: 'FIELD_OFFICER',
        isActive: true,
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        console.log('UserModal rendered', { user, isDeveloper });
        if (user) {
            setFormData({
                email: user.email || '',
                username: user.username || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || '',
                department: (user as any).department || '',
                password: '',
                role: user.role || 'FIELD_OFFICER',
                isActive: user.isActive ?? true,
            });
        } else {
            setFormData({
                email: '',
                username: '',
                firstName: '',
                lastName: '',
                phone: '',
                department: '',
                password: '',
                role: 'FIELD_OFFICER',
                isActive: true,
            });
        }
    }, [user, isDeveloper]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submitData: any = { ...formData };
        if (user && !submitData.password) {
            delete submitData.password;
        }
        onSave(submitData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{user ? '✏️ แก้ไขผู้ใช้' : '➕ เพิ่มผู้ใช้ใหม่'}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>
                            📧 Email <span className="required">*</span>
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            disabled={!!user}
                            placeholder="user@obtwiang.go.th"
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            👤 Username <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            placeholder="username"
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            📝 ชื่อ <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                            placeholder="ชื่อ"
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            📝 นามสกุล <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required
                            placeholder="นามสกุล"
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            📞 เบอร์โทรศัพท์
                        </label>
                        <input
                            type="tel"
                            className="form-control"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="081-234-5678"
                            pattern="[0-9-]+"
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            🏢 ส่วนงาน
                        </label>
                        <select
                            className="form-control"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        >
                            <option value="">-- เลือกส่วนงาน --</option>
                            <option value="สำนักปลัด">สำนักปลัด</option>
                            <option value="กองคลัง">กองคลัง</option>
                            <option value="กองช่าง">กองช่าง</option>
                            <option value="กองการศึกษา">กองการศึกษา</option>
                            <option value="กองสาธารณสุข">กองสาธารณสุข</option>
                            <option value="กองสวัสดิการสังคม">กองสวัสดิการสังคม</option>
                            <option value="กองยุทธศาสตร์">กองยุทธศาสตร์</option>
                            <option value="หน่วยตรวจสอบภายใน">หน่วยตรวจสอบภายใน</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>
                            🔒 Password {user && '(เว้นว่างถ้าไม่ต้องการเปลี่ยน)'}
                            {!user && <span className="required">*</span>}
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required={!user}
                                placeholder="••••••••"
                                style={{ paddingRight: '3rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1.25rem',
                                    padding: '0.25rem',
                                    color: '#666',
                                }}
                                title={showPassword ? 'ซ่อน Password' : 'แสดง Password'}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                        <small style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                            💡 คลิกไอคอนตาเพื่อดู Password (สำหรับส่งมอบให้บุคคลที่ 3)
                        </small>
                    </div>

                    <div className="form-group">
                        <label>
                            🎭 บทบาท <span className="required">*</span>
                        </label>
                        <select
                            className="form-control"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                        >
                            <option value="ADMIN">👑 Admin</option>
                            <option value="EXECUTIVE">💼 Executive</option>
                            <option value="SUPERVISOR">👨‍💼 Supervisor</option>
                            <option value="FIELD_OFFICER">🎯 Field Officer</option>
                            {isDeveloper && <option value="DEVELOPER">💻 Developer</option>}
                        </select>
                        {!isDeveloper && (
                            <small style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                                💡 บทบาท Developer สามารถจัดการได้โดย Developer เท่านั้น
                            </small>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="toggle-label">
                            <span className="toggle-text">สถานะการใช้งาน</span>
                            <div className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                                <span className="toggle-slider"></span>
                            </div>
                            <span className={`toggle-status ${formData.isActive ? 'active' : 'inactive'}`}>
                                {formData.isActive ? '✅ เปิดใช้งาน' : '❌ ปิดใช้งาน'}
                            </span>
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            ❌ ยกเลิก
                        </button>
                        <button type="submit" className="btn-primary">
                            💾 บันทึก
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
