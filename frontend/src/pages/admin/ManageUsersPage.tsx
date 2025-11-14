/**
 * Manage Users Page - Admin
 * จัดการผู้ใช้งาน
 */

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import usersApi, { type User } from '../../services/userService';
import toast from 'react-hot-toast';

export default function ManageUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <DashboardLayout>
      <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>👤 จัดการผู้ใช้ (Manage Users)</h1>
        <p className="subtitle">จัดการบัญชีผู้ใช้งานทั้งหมดในระบบ</p>
      </div>

      <div className="dashboard-content">
        {/* Search and Filter */}
        <div className="content-card">
          <div className="search-filter-bar">
            <input
              type="text"
              placeholder="🔍 ค้นหาผู้ใช้..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="all">ทุกบทบาท</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPERVISOR">Supervisor</option>
              <option value="FIELD_OFFICER">Field Officer</option>
              <option value="EXECUTIVE">Executive</option>
              <option value="DEVELOPER">Developer</option>
            </select>
            <button className="btn-primary">+ เพิ่มผู้ใช้ใหม่</button>
          </div>
        </div>

        {/* Users Table */}
        <div className="content-card">
          <h2>รายชื่อผู้ใช้งาน ({users.length})</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>ชื่อ-นามสกุล</th>
                <th>บทบาท</th>
                <th>สถานะ</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{`${user.firstName} ${user.lastName}`}</td>
                  <td><span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span></td>
                  <td><span className={`status-badge ${user.isActive ? 'ACTIVE' : 'INACTIVE'}`}>✅ {user.isActive ? 'ACTIVE' : 'INACTIVE'}</span></td>
                  <td>
                    <button className="btn-edit">✏️ แก้ไข</button>
                    <button className="btn-delete">🗑️ ลบ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="content-card">
          <div className="placeholder-content">
            <p>💡 หน้านี้จะเชื่อมต่อกับ API จริงในเฟสถัดไป</p>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}
