/**
 * Manage Users Page - Admin
 * จัดการผู้ใช้งาน
 */

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import usersApi, { type User } from '../../services/userService';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../stores/authStore';
import './ManageUsersPage.css';

export default function ManageUsersPage() {
  const currentUser = useAuthStore((state) => state.user);
  const isDeveloper = currentUser?.role === 'DEVELOPER';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (error) {
      toast.error('โหลดข้อมูลผู้ใช้ไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId: string) => {
    // Find user details for confirmation dialog
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const result = await Swal.fire({
      title: '⚠️ ยืนยันการลบผู้ใช้',
      html: `
        <p>คุณแน่ใจหรือไม่ที่จะลบผู้ใช้:</p>
        <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #dc3545;">
          <div style="margin-bottom: 8px;">
            <strong style="font-size: 18px; color: #dc3545;">👤 ${user.firstName} ${user.lastName}</strong>
          </div>
          <div style="color: #666; font-size: 14px;">
            📧 ${user.email}<br>
            ${user.role === 'ADMIN' ? '👑 ผู้ดูแลระบบ' : 
              user.role === 'SUPERVISOR' ? '👨‍💼 หัวหน้างาน' : 
              user.role === 'FIELD_OFFICER' ? '👷 เจ้าหน้าที่ภาคสนาม' : 
              user.role === 'DEVELOPER' ? '💻 นักพัฒนา' : user.role}
          </div>
        </div>
        <div style="margin-top: 15px; padding: 12px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
          <strong style="color: #856404;">⚠️ คำเตือน:</strong><br>
          <small style="color: #856404;">
            ผู้ใช้จะถูกลบอย่างถาวร และไม่สามารถกู้คืนได้!<br>
            ข้อมูลทั้งหมดที่เกี่ยวข้องจะถูกลบด้วย
          </small>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '🗑️ ยืนยันลบผู้ใช้',
      cancelButtonText: '❌ ยกเลิก',
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        await usersApi.delete(userId);
        toast.success('ลบผู้ใช้สำเร็จ');
        loadUsers();
      } catch (error) {
        toast.error('ลบผู้ใช้ไม่สำเร็จ');
      }
    }
  };

  const handleSaveUser = async (userData: any) => {
    try {
      if (editingUser) {
        await usersApi.update(editingUser.id, userData);
        toast.success('แก้ไขผู้ใช้สำเร็จ');
      } else {
        await usersApi.create(userData);
        toast.success('เพิ่มผู้ใช้สำเร็จ');
      }
      setShowModal(false);
      loadUsers();
    } catch (error) {
      toast.error('บันทึกข้อมูลไม่สำเร็จ');
    }
  };

  const filteredUsers = users.filter(user => {
    // ซ่อน Developer role จาก non-developer users
    if (user.role === 'DEVELOPER' && !isDeveloper) {
      return false;
    }
    
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <DashboardLayout>
      <div className="manage-users-page">
        <div className="page-header">
          <h1>👤 จัดการผู้ใช้งาน</h1>
          <p className="subtitle">จัดการบัญชีผู้ใช้งานทั้งหมดในระบบ Guardian Route</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{users.length}</div>
            <div className="stat-label">ผู้ใช้ทั้งหมด</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{users.filter(u => u.isActive).length}</div>
            <div className="stat-label">ใช้งานอยู่</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👑</div>
            <div className="stat-value">{users.filter(u => u.role === 'ADMIN').length}</div>
            <div className="stat-label">Admin</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-value">{users.filter(u => u.role === 'FIELD_OFFICER').length}</div>
            <div className="stat-label">Field Officer</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="content-card">
          <div className="search-filter-bar">
            <input
              type="text"
              placeholder="🔍 ค้นหาผู้ใช้... (ชื่อ, email, username)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="all">📋 ทุกบทบาท</option>
              <option value="ADMIN">👑 Admin</option>
              <option value="EXECUTIVE">💼 Executive</option>
              <option value="SUPERVISOR">👨‍💼 Supervisor</option>
              <option value="FIELD_OFFICER">🎯 Field Officer</option>
              {isDeveloper && <option value="DEVELOPER">💻 Developer</option>}
            </select>
            <button className="btn-add-user" onClick={handleAddUser}>
              <span className="btn-icon">➕</span>
              <span className="btn-text">เพิ่มผู้ใช้ใหม่</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="content-card">
          <h2>📋 รายชื่อผู้ใช้งาน ({filteredUsers.length}/{users.length})</h2>
          
          {loading ? (
            <div className="empty-state">
              <div className="empty-state-icon">⏳</div>
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <p>ไม่พบผู้ใช้ที่ตรงกับเงื่อนไขการค้นหา</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Username</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>เบอร์โทร</th>
                  <th>ส่วนงาน</th>
                  <th>บทบาท</th>
                  <th>สถานะ</th>
                  <th>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.username}</td>
                    <td>{`${user.firstName} ${user.lastName}`}</td>
                    <td>{user.phone || '-'}</td>
                    <td>{(user as any).department || '-'}</td>
                    <td>
                      <span className={`role-badge ${user.role.toLowerCase()}`}>
                        {user.role === 'ADMIN' && '👑 '}
                        {user.role === 'EXECUTIVE' && '💼 '}
                        {user.role === 'SUPERVISOR' && '👨‍💼 '}
                        {user.role === 'FIELD_OFFICER' && '🎯 '}
                        {user.role === 'DEVELOPER' && '💻 '}
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                        {user.isActive ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit" onClick={() => handleEditUser(user)}>
                          ✏️ แก้ไข
                        </button>
                        <button className="btn-delete" onClick={() => handleDeleteUser(user.id)}>
                          🗑️ ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* User Modal */}
        {showModal && (
          <UserModal
            user={editingUser}
            onSave={handleSaveUser}
            onClose={() => setShowModal(false)}
            isDeveloper={isDeveloper}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

// User Modal Component
function UserModal({ user, onSave, onClose, isDeveloper }: { user: User | null; onSave: (data: any) => void; onClose: () => void; isDeveloper: boolean }) {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    username: user?.username || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    department: (user as any)?.department || '',
    password: '',
    role: user?.role || 'FIELD_OFFICER',
    isActive: user?.isActive ?? true,
  });
  const [showPassword, setShowPassword] = useState(false);

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
