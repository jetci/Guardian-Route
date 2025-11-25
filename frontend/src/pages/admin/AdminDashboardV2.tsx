import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import usersApi, { type User, type CreateUserDto, type UpdateUserDto } from '../../services/userService';
import statisticsService from '../../services/statisticsService';
import { UserModal } from '../../components/admin/UserModal';
import { useAuthStore } from '../../stores/authStore';
import './AdminDashboard.css';

// Removed mock users - using real API
/* const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@obtwiang.go.th',
    firstName: 'Admin',
    lastName: 'System',
    role: 'ADMIN',
    status: 'ACTIVE',
    phone: '081-234-5678',
    createdAt: '2025-01-15'
  },
  {
    id: 2,
    username: 'executive',
    email: 'executive@obtwiang.go.th',
    firstName: 'Somkid',
    lastName: 'Executive',
    role: 'EXECUTIVE',
    status: 'ACTIVE',
    phone: '081-234-5681',
    createdAt: '2025-01-20'
  },
  {
    id: 3,
    username: 'supervisor',
    email: 'supervisor@obtwiang.go.th',
    firstName: 'Somchai',
    lastName: 'Supervisor',
    role: 'SUPERVISOR',
    status: 'ACTIVE',
    phone: '081-234-5679',
    createdAt: '2025-02-01'
  },
  {
    id: 4,
    username: 'field1',
    email: 'field1@obtwiang.go.th',
    firstName: 'Somsri',
    lastName: 'Field',
    role: 'FIELD_OFFICER',
    status: 'ACTIVE',
    phone: '081-234-5680',
    createdAt: '2025-02-10'
  },
  {
    id: 5,
    username: 'field2',
    email: 'field2@obtwiang.go.th',
    firstName: 'Somying',
    lastName: 'Rakdee',
    role: 'FIELD_OFFICER',
    status: 'ACTIVE',
    phone: '081-234-5682',
    createdAt: '2025-02-15'
  },
  {
    id: 6,
    username: 'field3',
    email: 'field3@obtwiang.go.th',
    firstName: 'Prasit',
    lastName: 'Mankong',
    role: 'FIELD_OFFICER',
    status: 'INACTIVE',
    phone: '081-234-5683',
    createdAt: '2025-03-01'
  }
];

// Removed mock activity logs - using real API
/* const mockActivityLogs = [
  {
    id: 1,
    user: 'admin@obtwiang.go.th',
    action: 'Created User',
    target: 'field3@obtwiang.go.th',
    timestamp: '2025-11-13 08:30:15',
    status: 'SUCCESS'
  },
  {
    id: 2,
    user: 'supervisor@obtwiang.go.th',
    action: 'Updated Incident',
    target: 'INC-2025-001',
    timestamp: '2025-11-13 08:15:42',
    status: 'SUCCESS'
  },
  {
    id: 3,
    user: 'field1@obtwiang.go.th',
    action: 'Submitted Report',
    target: 'RPT-2025-045',
    timestamp: '2025-11-13 07:45:20',
    status: 'SUCCESS'
  },
  {
    id: 4,
    user: 'admin@obtwiang.go.th',
    action: 'Changed Role',
    target: 'field2@obtwiang.go.th',
    timestamp: '2025-11-13 07:30:10',
    status: 'SUCCESS'
  },
  {
    id: 5,
    user: 'executive@obtwiang.go.th',
    action: 'Approved Report',
    target: 'RPT-2025-044',
    timestamp: '2025-11-13 07:00:05',
    status: 'SUCCESS'
  }
]; */

type UserFormData = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone: string;
  password?: string;
};

export default function AdminDashboard() {
  const currentUser = useAuthStore((state) => state.user);
  const isDeveloper = currentUser?.role === 'DEVELOPER';

  // State
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Loading & Error states
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stats state
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeIncidents: 0,
    pendingReports: 0,
    systemHealth: 0
  });

  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  // Fetch data on mount
  useEffect(() => {
    fetchUsers();
    fetchStatistics();
    fetchActivityLogs();
    console.log('AdminDashboardV2 loaded - Unified Modal Version');
  }, []);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getAll();
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
      toast.error('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      setStatsLoading(true);
      const users = await usersApi.getAll();

      let activeIncidents = 0;
      let pendingReports = 0;

      try {
        const incidentStats = await statisticsService.getIncidentStatistics();
        activeIncidents = (incidentStats.byStatus?.IN_PROGRESS || 0) + (incidentStats.byStatus?.PENDING || 0);
      } catch (err) {
        console.error('Failed to fetch incident statistics:', err);
      }

      try {
        const reportStats = await statisticsService.getReportStatistics();
        pendingReports = reportStats.pending || 0;
      } catch (err) {
        console.error('Failed to fetch report statistics:', err);
      }

      setStats({
        totalUsers: users.length,
        activeIncidents,
        pendingReports,
        systemHealth: 98 // TODO: Get from health endpoint
      });
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch activity logs
  const fetchActivityLogs = async () => {
    try {
      const response = await statisticsService.getActivityLogs({ limit: 20 });
      setActivityLogs(response.data);
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
    }
  };

  // Filter users - ADMIN cannot see DEVELOPER users
  const filteredUsers = users.filter(user => {
    // Hide DEVELOPER users from ADMIN
    if (user.role === 'DEVELOPER') {
      return false;
    }

    const matchesSearch =
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || (user.isActive ? 'ACTIVE' : 'INACTIVE') === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Role counts
  const roleCounts = {
    ADMIN: users.filter(u => u.role === 'ADMIN').length,
    EXECUTIVE: users.filter(u => u.role === 'EXECUTIVE').length,
    SUPERVISOR: users.filter(u => u.role === 'SUPERVISOR').length,
    FIELD_OFFICER: users.filter(u => u.role === 'FIELD_OFFICER').length
  };

  const handleSaveUser = async (userData: any) => {
    try {
      if (selectedUser) {
        await usersApi.update(selectedUser.id, userData);
        toast.success('อัพเดทผู้ใช้สำเร็จ!');
      } else {
        await usersApi.create(userData);
        toast.success('สร้างผู้ใช้สำเร็จ!');
      }
      setShowModal(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh list
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลผู้ใช้ได้');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await usersApi.delete(selectedUser.id);
      toast.success('ลบผู้ใช้สำเร็จ!');
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh list
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'ไม่สามารถลบผู้ใช้ได้');
    }
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const openDeleteModal = (user: any) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      await usersApi.toggleStatus(userId);
      toast.success('เปลี่ยนสถานะผู้ใช้สำเร็จ!');
      fetchUsers(); // Refresh list
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'ไม่สามารถเปลี่ยนสถานะได้');
    }
  };

  return (
    <DashboardLayout>
      <div style={{ width: '100%', maxWidth: '100%', margin: 0, padding: 0 }}>
        <header style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '5px', color: '#1f2937' }}>🛡️ Admin Dashboard</h2>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>จัดการผู้ใช้และระบบ</p>
        </header>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card purple">
            <div className="kpi-icon">👥</div>
            <div className="kpi-content">
              <h3>{statsLoading ? '...' : (stats.totalUsers || 0)}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div className="kpi-card blue">
            <div className="kpi-icon">🚨</div>
            <div className="kpi-content">
              <h3>{statsLoading ? '...' : (stats.activeIncidents || 0)}</h3>
              <p>Active Incidents</p>
            </div>
          </div>

          <div className="kpi-card orange">
            <div className="kpi-icon">📋</div>
            <div className="kpi-content">
              <h3>{statsLoading ? '...' : (stats.pendingReports || 0)}</h3>
              <p>Pending Reports</p>
            </div>
          </div>

          <div className="kpi-card green">
            <div className="kpi-icon">💚</div>
            <div className="kpi-content">
              <h3>{statsLoading ? '...' : `${stats.systemHealth || 0}%`}</h3>
              <p>System Health</p>
            </div>
          </div>
        </div>

        {/* Role Statistics */}
        <div className="role-stats">
          <h3>📊 Users by Role</h3>
          <div className="role-cards">
            <div className="role-card">
              <span className="role-name">👑 ADMIN</span>
              <span className="role-count">{roleCounts.ADMIN}</span>
            </div>
            <div className="role-card">
              <span className="role-name">💼 EXECUTIVE</span>
              <span className="role-count">{roleCounts.EXECUTIVE}</span>
            </div>
            <div className="role-card">
              <span className="role-name">👨‍💼 SUPERVISOR</span>
              <span className="role-count">{roleCounts.SUPERVISOR}</span>
            </div>
            <div className="role-card">
              <span className="role-name">🎯 FIELD OFFICER</span>
              <span className="role-count">{roleCounts.FIELD_OFFICER}</span>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="user-management">
          <div className="section-header">
            <h3>👥 จัดการผู้ใช้งาน</h3>
            <button className="btn-primary" onClick={openCreateModal}>
              ➕ เพิ่มผู้ใช้ใหม่
            </button>
          </div>

          {/* Filters */}
          <div className="filters">
            <input
              type="text"
              placeholder="🔍 ค้นหาผู้ใช้งาน..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">ทุกบทบาท</option>
              <option value="ADMIN">ผู้ดูแลระบบ</option>
              <option value="EXECUTIVE">ผู้บริหาร</option>
              <option value="SUPERVISOR">หัวหน้างาน</option>
              <option value="FIELD_OFFICER">เจ้าหน้าที่ภาคสนาม</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">ทุกสถานะ</option>
              <option value="ACTIVE">ใช้งาน</option>
              <option value="INACTIVE">ระงับ</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="table-container">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>กำลังโหลดข้อมูลผู้ใช้...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>❌ {error}</p>
                <button onClick={fetchUsers} className="btn-secondary">ลองใหม่</button>
              </div>
            ) : (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ชื่อผู้ใช้</th>
                    <th>ชื่อ-นามสกุล</th>
                    <th>อีเมล</th>
                    <th>บทบาท</th>
                    <th>สถานะ</th>
                    <th>เบอร์โทร</th>
                    <th>วันที่สร้าง</th>
                    <th>การกระทำ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="empty-state">
                        ไม่พบข้อมูลผู้ใช้
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td><strong>{user.username}</strong></td>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role.toLowerCase()}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}
                            onClick={() => toggleUserStatus(user.id)}
                          >
                            {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </button>
                        </td>
                        <td>{user.phone || '-'}</td>
                        <td>{user.createdAt}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon edit"
                              onClick={() => openEditModal(user)}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              className="btn-icon delete"
                              onClick={() => openDeleteModal(user)}
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Activity Logs */}
        <div className="activity-logs">
          <h3>📜 Recent Activity</h3>
          <div className="table-container">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Target</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activityLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-state">
                      No activity logs found
                    </td>
                  </tr>
                ) : (
                  activityLogs.map((log: any) => (
                    <tr key={log.id}>
                      <td>{new Date(log.timestamp).toLocaleString('th-TH')}</td>
                      <td>{log.user?.email || 'Unknown'}</td>
                      <td><strong>{log.action}</strong></td>
                      <td>{log.target || '-'}</td>
                      <td>
                        <span className={`status-badge ${log.status.toLowerCase()}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Modal */}
        {showModal && (
          <UserModal
            user={selectedUser}
            onSave={handleSaveUser}
            onClose={() => setShowModal(false)}
            isDeveloper={isDeveloper}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedUser && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal small" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>🗑️ Delete User</h3>
                <button onClick={() => setShowDeleteModal(false)}>✕</button>
              </div>

              <div className="delete-confirmation">
                <p>Are you sure you want to delete this user?</p>
                <div className="user-info">
                  <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>
                  <span>{selectedUser.email}</span>
                </div>
                <p className="warning">⚠️ This action cannot be undone!</p>
              </div>

              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button className="btn-danger" onClick={handleDeleteUser}>
                  🗑️ Delete User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
