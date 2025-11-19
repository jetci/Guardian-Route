/**
 * Audit Logs Page - Admin
 * Activity Logs (Audit Trail)
 */

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import toast from 'react-hot-toast';
import ThaiDatePicker from '../../components/ThaiDatePicker';
import './AuditLogsPage.css';

interface ActivityLog {
  id: string;
  action: string;
  userId: string;
  incidentId?: string;
  details?: Record<string, unknown>;
  createdAt: string;
  user?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  incident?: {
    id: string;
    title: string;
  };
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 20;

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // Mock data for demonstration
      const mockLogs: ActivityLog[] = Array.from({ length: 50 }, (_, i) => ({
        id: `log-${i + 1}`,
        action: ['CREATE_INCIDENT', 'UPDATE_INCIDENT', 'DELETE_INCIDENT', 'ASSIGN_INCIDENT', 'REVIEW_INCIDENT', 'LOGIN', 'LOGOUT'][i % 7],
        userId: `user-${(i % 5) + 1}`,
        incidentId: i % 3 === 0 ? `incident-${i}` : undefined,
        details: i % 2 === 0 ? { severity: 'HIGH', type: 'FLOOD' } : undefined,
        createdAt: new Date(Date.now() - i * 3600000).toISOString(),
        user: {
          id: `user-${(i % 5) + 1}`,
          username: ['admin', 'supervisor', 'field1', 'executive', 'developer'][i % 5],
          firstName: ['ผู้ดูแล', 'หัวหน้า', 'เจ้าหน้าที่', 'ผู้บริหาร', 'นักพัฒนา'][i % 5],
          lastName: 'ระบบ',
          role: ['ADMIN', 'SUPERVISOR', 'FIELD_OFFICER', 'EXECUTIVE', 'DEVELOPER'][i % 5],
        },
        incident: i % 3 === 0 ? {
          id: `incident-${i}`,
          title: `เหตุการณ์ ${i + 1}`,
        } : undefined,
      }));
      
      setLogs(mockLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('ไม่สามารถโหลดข้อมูล Activity Logs ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchLogs();
  };

  const handleReset = () => {
    setActionFilter('');
    setUserFilter('');
    setDateFilter(null);
    setCurrentPage(1);
    fetchLogs();
  };

  const handleExport = () => {
    toast.success('กำลังส่งออกข้อมูล...');
    // TODO: Implement export functionality
  };

  const getActionClass = (action: string): string => {
    const map: Record<string, string> = {
      CREATE_INCIDENT: 'create',
      UPDATE_INCIDENT: 'update',
      DELETE_INCIDENT: 'delete',
      ASSIGN_INCIDENT: 'assign',
      REVIEW_INCIDENT: 'review',
      LOGIN: 'login',
      LOGOUT: 'logout',
    };
    return map[action] || 'login';
  };

  const getActionLabel = (action: string): string => {
    const labels: Record<string, string> = {
      CREATE_INCIDENT: 'สร้างเหตุการณ์',
      UPDATE_INCIDENT: 'แก้ไขเหตุการณ์',
      DELETE_INCIDENT: 'ลบเหตุการณ์',
      ASSIGN_INCIDENT: 'มอบหมายเหตุการณ์',
      REVIEW_INCIDENT: 'ตรวจสอบเหตุการณ์',
      LOGIN: 'เข้าสู่ระบบ',
      LOGOUT: 'ออกจากระบบ',
    };
    return labels[action] || action;
  };

  // Pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Stats
  const todayLogs = logs.filter(log => {
    const logDate = new Date(log.createdAt);
    const today = new Date();
    return logDate.toDateString() === today.toDateString();
  });

  const uniqueUsers = new Set(logs.map(log => log.userId)).size;
  const incidentLogs = logs.filter(log => log.incidentId).length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="audit-logs-page">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p className="loading-text">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="audit-logs-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>📊 Activity Logs (Audit Trail)</h1>
            <p className="subtitle">ติดตามและตรวจสอบกิจกรรมทั้งหมดในระบบ</p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📋</div>
            <div className="stat-value">{logs.length}</div>
            <div className="stat-label">กิจกรรมทั้งหมด</div>
          </div>
          <div className="stat-card today">
            <div className="stat-icon">📅</div>
            <div className="stat-value">{todayLogs.length}</div>
            <div className="stat-label">กิจกรรมวันนี้</div>
          </div>
          <div className="stat-card users">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{uniqueUsers}</div>
            <div className="stat-label">ผู้ใช้งาน</div>
          </div>
          <div className="stat-card incidents">
            <div className="stat-icon">⚠️</div>
            <div className="stat-value">{incidentLogs}</div>
            <div className="stat-label">เหตุการณ์</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-card">
          <h2>🔍 ค้นหาและกรองข้อมูล</h2>
          <div className="filters-grid">
            <div className="filter-group">
              <label>Action</label>
              <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
                <option value="">-- ทั้งหมด --</option>
                <option value="CREATE_INCIDENT">สร้างเหตุการณ์</option>
                <option value="UPDATE_INCIDENT">แก้ไขเหตุการณ์</option>
                <option value="DELETE_INCIDENT">ลบเหตุการณ์</option>
                <option value="ASSIGN_INCIDENT">มอบหมายเหตุการณ์</option>
                <option value="REVIEW_INCIDENT">ตรวจสอบเหตุการณ์</option>
                <option value="LOGIN">เข้าสู่ระบบ</option>
                <option value="LOGOUT">ออกจากระบบ</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="กรอก username"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>วันที่</label>
              <ThaiDatePicker
                id="audit-date-filter"
                value={dateFilter}
                onChange={setDateFilter}
                placeholder="เลือกวันที่"
              />
            </div>
          </div>

          <div className="filter-actions">
            <button className="btn-filter" onClick={handleFilter}>
              🔍 ค้นหา
            </button>
            <button className="btn-reset" onClick={handleReset}>
              🔄 รีเซ็ต
            </button>
            <button className="btn-export" onClick={handleExport}>
              📥 ส่งออก CSV
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="logs-card">
          <div className="logs-header">
            <h2>📋 รายการกิจกรรม</h2>
            <span className="logs-count">แสดง {currentLogs.length} จาก {logs.length} รายการ</span>
          </div>

          {currentLogs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p className="empty-text">ไม่พบข้อมูล Activity Logs</p>
              <p className="empty-hint">ลองเปลี่ยนเงื่อนไขการค้นหา</p>
            </div>
          ) : (
            <>
              <div className="logs-table-wrapper">
                <table className="logs-table">
                  <thead>
                    <tr>
                      <th>เวลา</th>
                      <th>Action</th>
                      <th>ผู้ใช้งาน</th>
                      <th>เหตุการณ์</th>
                      <th>รายละเอียด</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="log-time">
                          <div className="log-date">
                            {format(new Date(log.createdAt), 'dd MMM yyyy', { locale: th })}
                          </div>
                          <div className="log-clock">
                            {format(new Date(log.createdAt), 'HH:mm:ss')}
                          </div>
                        </td>
                        <td className="log-action">
                          <span className={`action-badge ${getActionClass(log.action)}`}>
                            {getActionLabel(log.action)}
                          </span>
                        </td>
                        <td className="log-user">
                          {log.user ? (
                            <>
                              <div className="user-name">
                                {log.user.firstName} {log.user.lastName}
                              </div>
                              <div className="user-details">
                                @{log.user.username}
                                <span className="user-role">{log.user.role}</span>
                              </div>
                            </>
                          ) : (
                            <div className="user-details">{log.userId}</div>
                          )}
                        </td>
                        <td className="log-incident">
                          {log.incident ? (
                            <>
                              <div className="incident-title">{log.incident.title}</div>
                              <div className="incident-id">{log.incident.id}</div>
                            </>
                          ) : log.incidentId ? (
                            <div className="incident-id">{log.incidentId}</div>
                          ) : (
                            <span className="details-empty">-</span>
                          )}
                        </td>
                        <td className="log-details">
                          {log.details ? (
                            <div className="details-json">
                              {JSON.stringify(log.details, null, 2)}
                            </div>
                          ) : (
                            <span className="details-empty">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-button"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ← ก่อนหน้า
                  </button>
                  
                  <span className="pagination-info">
                    หน้า {currentPage} จาก {totalPages}
                  </span>

                  <button
                    className="pagination-button"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    ถัดไป →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
