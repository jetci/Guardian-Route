/**
 * User Profile Page
 * Manage user profile, change password, view activity
 */

import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import profileService, { type UserProfile, type UpdateProfileDto, type ChangePasswordDto, type ActivityLog } from '../services/profileService';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import './ProfilePage.css';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'password' | 'activity'>('info');

  // Profile edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UpdateProfileDto>({
    firstName: '',
    lastName: '',
    phone: '',
    department: '',
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState<ChangePasswordDto>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Activity logs state
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Profile image state
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      setProfile(data);
      setEditForm({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || '',
        department: data.department || '',
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('ไม่สามารถโหลดข้อมูลโปรไฟล์ได้');
    } finally {
      setLoading(false);
    }
  };

  const loadActivityLogs = async () => {
    try {
      setLoadingLogs(true);
      const logs = await profileService.getActivityLogs(20);
      setActivityLogs(logs);
    } catch (error) {
      console.error('Error loading activity logs:', error);
      toast.error('ไม่สามารถโหลดประวัติกิจกรรมได้');
    } finally {
      setLoadingLogs(false);
    }
  };

  // Load activity logs when tab is active
  useEffect(() => {
    if (activeTab === 'activity' && activityLogs.length === 0) {
      loadActivityLogs();
    }
  }, [activeTab]);

  const handleEditProfile = async () => {
    try {
      const updatedProfile = await profileService.updateProfile(editForm);
      setProfile(updatedProfile);
      setIsEditing(false);

      // Update auth store
      if (user) {
        updateUser({
          ...user,
          firstName: updatedProfile.firstName,
          lastName: updatedProfile.lastName,
        });
      }

      toast.success('อัปเดตข้อมูลโปรไฟล์สำเร็จ');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'ไม่สามารถอัปเดตข้อมูลได้');
    }
  };

  const handleChangePassword = async () => {
    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('รหัสผ่านใหม่ไม่ตรงกัน');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    try {
      await profileService.changePassword(passwordForm);

      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      toast.success('เปลี่ยนรหัสผ่านสำเร็จ');

      // Show success dialog
      Swal.fire({
        title: '✅ เปลี่ยนรหัสผ่านสำเร็จ',
        text: 'กรุณาเข้าสู่ระบบใหม่ด้วยรหัสผ่านใหม่',
        icon: 'success',
        confirmButtonText: 'ตกลง',
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'ไม่สามารถเปลี่ยนรหัสผ่านได้');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('ขนาดไฟล์ต้องไม่เกิน 5 MB');
      return;
    }

    try {
      setUploadingImage(true);
      const result = await profileService.uploadProfileImage(file);

      // Update profile
      if (profile) {
        setProfile({
          ...profile,
          profileImage: result.imageUrl,
        });
      }

      toast.success('อัปโหลดรูปโปรไฟล์สำเร็จ');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.response?.data?.message || 'ไม่สามารถอัปโหลดรูปภาพได้');
    } finally {
      setUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = async () => {
    const result = await Swal.fire({
      title: '⚠️ ยืนยันการลบรูปโปรไฟล์',
      text: 'คุณแน่ใจหรือไม่ที่จะลบรูปโปรไฟล์?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '🗑️ ลบรูป',
      cancelButtonText: '❌ ยกเลิก',
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        await profileService.deleteProfileImage();

        // Update profile
        if (profile) {
          setProfile({
            ...profile,
            profileImage: undefined,
          });
        }

        toast.success('ลบรูปโปรไฟล์สำเร็จ');
      } catch (error: any) {
        console.error('Error deleting image:', error);
        toast.error(error.response?.data?.message || 'ไม่สามารถลบรูปภาพได้');
      }
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'role-badge role-admin';
      case 'DEVELOPER':
        return 'role-badge role-developer';
      case 'SUPERVISOR':
        return 'role-badge role-supervisor';
      case 'FIELD_OFFICER':
        return 'role-badge role-field-officer';
      case 'EXECUTIVE':
        return 'role-badge role-executive';
      default:
        return 'role-badge';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return '👑';
      case 'DEVELOPER':
        return '💻';
      case 'SUPERVISOR':
        return '👨‍💼';
      case 'FIELD_OFFICER':
        return '👷';
      case 'EXECUTIVE':
        return '🎯';
      default:
        return '👤';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'ผู้ดูแลระบบ';
      case 'DEVELOPER':
        return 'นักพัฒนา';
      case 'SUPERVISOR':
        return 'หัวหน้างาน';
      case 'FIELD_OFFICER':
        return 'เจ้าหน้าที่ภาคสนาม';
      case 'EXECUTIVE':
        return 'ผู้บริหาร';
      default:
        return role;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="profile-page">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="profile-page">
          <div className="error-container">
            <p>❌ ไม่สามารถโหลดข้อมูลโปรไฟล์ได้</p>
            <button onClick={loadProfile} className="btn-retry">
              🔄 ลองอีกครั้ง
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="profile-page">
        {/* Header */}
        <div className="profile-header">
          <div>
            <h1>👤 โปรไฟล์ของฉัน</h1>
            <p className="subtitle">จัดการข้อมูลส่วนตัวและความปลอดภัยของบัญชี</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="avatar-container">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="avatar-image" />
              ) : (
                <div className="avatar-placeholder">
                  <span className="avatar-icon">{getRoleIcon(profile.role)}</span>
                </div>
              )}
              {uploadingImage && (
                <div className="avatar-uploading">
                  <div className="spinner-small"></div>
                </div>
              )}
            </div>

            <div className="avatar-actions">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-upload-image"
                disabled={uploadingImage}
              >
                📷 {profile.profileImage ? 'เปลี่ยนรูป' : 'อัปโหลดรูป'}
              </button>
              {profile.profileImage && (
                <button
                  onClick={handleDeleteImage}
                  className="btn-delete-image"
                  disabled={uploadingImage}
                >
                  🗑️ ลบรูป
                </button>
              )}
            </div>
          </div>

          <div className="profile-info-section">
            <h2>{profile.firstName} {profile.lastName}</h2>
            <p className="profile-email">📧 {profile.email}</p>
            <div className={getRoleBadgeClass(profile.role)}>
              {getRoleIcon(profile.role)} {getRoleLabel(profile.role)}
            </div>
            <div className="profile-meta">
              <span className={profile.isActive ? 'status-active' : 'status-inactive'}>
                {profile.isActive ? '✅ ใช้งานอยู่' : '❌ ไม่ได้ใช้งาน'}
              </span>
              <span className="join-date">
                📅 เข้าร่วมเมื่อ {formatDate(profile.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            📝 ข้อมูลส่วนตัว
          </button>
          <button
            className={`tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            🔒 เปลี่ยนรหัสผ่าน
          </button>
          <button
            className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            📊 ประวัติกิจกรรม
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Personal Info Tab */}
          {activeTab === 'info' && (
            <div className="info-tab">
              <div className="section-header">
                <h3>ข้อมูลส่วนตัว</h3>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="btn-edit">
                    ✏️ แก้ไข
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button onClick={handleEditProfile} className="btn-save">
                      💾 บันทึก
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({
                          firstName: profile.firstName,
                          lastName: profile.lastName,
                          phone: profile.phone || '',
                          department: profile.department || '',
                        });
                      }}
                      className="btn-cancel"
                    >
                      ❌ ยกเลิก
                    </button>
                  </div>
                )}
              </div>

              <div className="info-grid">
                <div className="info-field">
                  <label>ชื่อจริง *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      placeholder="ชื่อจริง"
                    />
                  ) : (
                    <p>{profile.firstName}</p>
                  )}
                </div>

                <div className="info-field">
                  <label>นามสกุล *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      placeholder="นามสกุล"
                    />
                  ) : (
                    <p>{profile.lastName}</p>
                  )}
                </div>

                <div className="info-field">
                  <label>อีเมล</label>
                  <p className="readonly">{profile.email}</p>
                  <small>ไม่สามารถเปลี่ยนอีเมลได้</small>
                </div>

                <div className="info-field">
                  <label>ชื่อผู้ใช้</label>
                  <p className="readonly">{profile.username}</p>
                  <small>ไม่สามารถเปลี่ยนชื่อผู้ใช้ได้</small>
                </div>

                <div className="info-field">
                  <label>เบอร์โทรศัพท์</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="0812345678"
                    />
                  ) : (
                    <p>{profile.phone || '-'}</p>
                  )}
                </div>

                <div className="info-field">
                  <label>หน่วยงาน</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.department}
                      onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                      placeholder="ระบุหน่วยงาน"
                    />
                  ) : (
                    <p>{profile.department || '-'}</p>
                  )}
                </div>

                <div className="info-field">
                  <label>บทบาท</label>
                  <p className="readonly">
                    {getRoleIcon(profile.role)} {getRoleLabel(profile.role)}
                  </p>
                  <small>ติดต่อผู้ดูแลระบบเพื่อเปลี่ยนบทบาท</small>
                </div>
              </div>
            </div>
          )}

          {/* Change Password Tab */}
          {activeTab === 'password' && (
            <div className="password-tab">
              <div className="section-header">
                <h3>เปลี่ยนรหัสผ่าน</h3>
              </div>

              <div className="password-form">
                <div className="form-field">
                  <label>รหัสผ่านปัจจุบัน *</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    placeholder="กรอกรหัสผ่านปัจจุบัน"
                  />
                </div>

                <div className="form-field">
                  <label>รหัสผ่านใหม่ *</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="กรอกรหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
                  />
                </div>

                <div className="form-field">
                  <label>ยืนยันรหัสผ่านใหม่ *</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                  />
                </div>

                <div className="password-requirements">
                  <h4>ข้อกำหนดรหัสผ่าน:</h4>
                  <ul>
                    <li className={passwordForm.newPassword.length >= 6 ? 'valid' : ''}>
                      {passwordForm.newPassword.length >= 6 ? '✅' : '⭕'} ความยาวอย่างน้อย 6 ตัวอักษร
                    </li>
                    <li className={passwordForm.newPassword === passwordForm.confirmPassword && passwordForm.newPassword ? 'valid' : ''}>
                      {passwordForm.newPassword === passwordForm.confirmPassword && passwordForm.newPassword ? '✅' : '⭕'} รหัสผ่านตรงกัน
                    </li>
                  </ul>
                </div>

                <button onClick={handleChangePassword} className="btn-change-password">
                  🔒 เปลี่ยนรหัสผ่าน
                </button>
              </div>
            </div>
          )}

          {/* Activity Log Tab */}
          {activeTab === 'activity' && (
            <div className="activity-tab">
              <div className="section-header">
                <h3>ประวัติกิจกรรมล่าสุด</h3>
                <button onClick={loadActivityLogs} className="btn-refresh" disabled={loadingLogs}>
                  🔄 รีเฟรช
                </button>
              </div>

              {loadingLogs ? (
                <div className="loading-logs">
                  <div className="spinner-small"></div>
                  <p>กำลังโหลดประวัติ...</p>
                </div>
              ) : activityLogs.length === 0 ? (
                <div className="no-activity">
                  <p>📭 ยังไม่มีประวัติกิจกรรม</p>
                </div>
              ) : (
                <div className="activity-list">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="activity-item">
                      <div className="activity-icon">
                        {log.action.includes('login') ? '🔐' :
                          log.action.includes('create') ? '➕' :
                            log.action.includes('update') ? '✏️' :
                              log.action.includes('delete') ? '🗑️' :
                                '📝'}
                      </div>
                      <div className="activity-content">
                        <p className="activity-description">{log.description}</p>
                        <div className="activity-meta">
                          <span className="activity-time">
                            🕐 {formatDate(log.timestamp)}
                          </span>
                          {log.ipAddress && (
                            <span className="activity-ip">
                              🌐 {log.ipAddress}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
