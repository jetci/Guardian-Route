import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import userService, { type User, type CreateUserDto, type UpdateUserDto } from '../../services/userService';
import statisticsService from '../../services/statisticsService';
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
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'FIELD_OFFICER',
    phone: '',
    password: ''
  });

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
  }, []);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers();
      setUsers(response.data);
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
      const [userStats, incidentStats, reportStats] = await Promise.all([
        userService.getUserStatistics(),
        statisticsService.getIncidentStatistics(),
        statisticsService.getReportStatistics()
      ]);

      setStats({
        totalUsers: userStats.total,
        activeIncidents: incidentStats.byStatus.IN_PROGRESS + incidentStats.byStatus.PENDING,
        pendingReports: reportStats.pending,
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
    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Role counts
  const roleCounts = {
    ADMIN: users.filter(u => u.role === 'ADMIN').length,
    EXECUTIVE: users.filter(u => u.role === 'EXECUTIVE').length,
    SUPERVISOR: users.filter(u => u.role === 'SUPERVISOR').length,
    FIELD_OFFICER: users.filter(u => u.role === 'FIELD_OFFICER').length
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData: CreateUserDto = {
        username: formData.username,
        email: formData.email,
        password: formData.password || 'password123',
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        phone: formData.phone
      };
      
      await userService.createUser(userData);
      toast.success('สร้างผู้ใช้สำเร็จ!');
      setShowCreateModal(false);
      resetForm();
      fetchUsers(); // Refresh list
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'ไม่สามารถสร้างผู้ใช้ได้');
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    try {
      const userData: UpdateUserDto = {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        phone: formData.phone
      };
      
      if (formData.password) {
        userData.password = formData.password;
      }
      
      await userService.updateUser(selectedUser.id, userData);
      toast.success('อัพเดทผู้ใช้สำเร็จ!');
      setShowEditModal(false);
      resetForm();
      fetchUsers(); // Refresh list
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'ไม่สามารถอัพเดทผู้ใช้ได้');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await userService.deleteUser(selectedUser.id);
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
    setFormData({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user: any) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      role: 'FIELD_OFFICER',
      phone: '',
      password: ''
    });
    setSelectedUser(null);
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      await userService.toggleUserStatus(userId);
      toast.success('เปลี่ยนสถานะผู้ใช้สำเร็จ!');
      fetchUsers(); // Refresh list
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'ไม่สามารถเปลี่ยนสถานะได้');
    }
  };

  return (
    <DashboardLayout>
      <div className="admin-dashboard">
        <header>
          <h2>🛡️ Admin Dashboard</h2>
          <p>จัดการผู้ใช้และระบบ</p>
        </header>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card purple">
            <div className="kpi-icon">👥</div>
            <div className="kpi-content">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>
          
          <div className="kpi-card blue">
            <div className="kpi-icon">🚨</div>
            <div className="kpi-content">
              <h3>{stats.activeIncidents}</h3>
              <p>Active Incidents</p>
            </div>
          </div>
          
          <div className="kpi-card orange">
            <div className="kpi-icon">📋</div>
            <div className="kpi-content">
              <h3>{stats.pendingReports}</h3>
              <p>Pending Reports</p>
            </div>
          </div>
          
          <div className="kpi-card green">
            <div className="kpi-icon">💚</div>
            <div className="kpi-content">
              <h3>{stats.systemHealth}%</h3>
              <p>System Health</p>
            </div>
          </div>
        </div>

        {/* Role Statistics */}
        <div className="role-stats">
          <h3>📊 Users by Role</h3>
          <div className="role-cards">
            <div className="role-card">
              <span className="role-badge admin">ADMIN</span>
              <span className="role-count">{roleCounts.ADMIN}</span>
            </div>
            <div className="role-card">
              <span className="role-badge executive">EXECUTIVE</span>
              <span className="role-count">{roleCounts.EXECUTIVE}</span>
            </div>
            <div className="role-card">
              <span className="role-badge supervisor">SUPERVISOR</span>
              <span className="role-count">{roleCounts.SUPERVISOR}</span>
            </div>
            <div className="role-card">
              <span className="role-badge field">FIELD OFFICER</span>
              <span className="role-count">{roleCounts.FIELD_OFFICER}</span>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="user-management">
          <div className="section-header">
            <h3>👥 User Management</h3>
            <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
              ➕ Create User
            </button>
          </div>

          {/* Filters */}
          <div className="filters">
            <input
              type="text"
              placeholder="🔍 Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="EXECUTIVE">Executive</option>
              <option value="SUPERVISOR">Supervisor</option>
              <option value="FIELD_OFFICER">Field Officer</option>
            </select>

            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="table-container">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading users...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>❌ {error}</p>
                <button onClick={fetchUsers} className="btn-secondary">Retry</button>
              </div>
            ) : (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Phone</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="empty-state">
                        No users found
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
                          className={`status-badge ${(user.status || 'ACTIVE').toLowerCase()}`}
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.status || 'ACTIVE'}
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

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>➕ Create New User</h3>
                <button onClick={() => setShowCreateModal(false)}>✕</button>
              </div>
              
              <form onSubmit={handleCreateUser}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Username *</label>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      placeholder="username"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="email@obtwiang.go.th"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      placeholder="First name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Role *</label>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                    >
                      <option value="FIELD_OFFICER">Field Officer</option>
                      <option value="SUPERVISOR">Supervisor</option>
                      <option value="EXECUTIVE">Executive</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="081-234-5678"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Enter password"
                  />
                </div>
                
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    ✅ Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && selectedUser && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>✏️ Edit User</h3>
                <button onClick={() => setShowEditModal(false)}>✕</button>
              </div>
              
              <form onSubmit={handleEditUser}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Username *</label>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Role *</label>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                    >
                      <option value="FIELD_OFFICER">Field Officer</option>
                      <option value="SUPERVISOR">Supervisor</option>
                      <option value="EXECUTIVE">Executive</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    💾 Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
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
