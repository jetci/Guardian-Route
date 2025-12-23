import React, { useState } from 'react';
import '../../pages/admin/AuditLogsPage.css';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ThaiDatePicker from '../ThaiDatePicker';
import toast from 'react-hot-toast';

interface AuditLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: any;
  ipAddress?: string;
  createdAt: string;
}

const AuditLogTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [targetTypeFilter, setTargetTypeFilter] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Fetch audit logs
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'audit-logs', page, actionFilter, targetTypeFilter, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', '50');
      if (actionFilter) params.append('action', actionFilter);
      if (targetTypeFilter) params.append('targetType', targetTypeFilter);
      if (startDate) params.append('startDate', startDate.toISOString().split('T')[0]);
      if (endDate) params.append('endDate', endDate.toISOString().split('T')[0]);

      const { data } = await axios.get(`/api/admin/audit-logs?${params}`);
      return data;
    },
    keepPreviousData: true,
  });

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (actionFilter) params.append('action', actionFilter);
      if (targetTypeFilter) params.append('targetType', targetTypeFilter);
      if (startDate) params.append('startDate', startDate.toISOString().split('T')[0]);
      if (endDate) params.append('endDate', endDate.toISOString().split('T')[0]);

      const response = await axios.get(`/api/admin/audit-logs/export/csv?${params}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit-logs-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('ดาวน์โหลด CSV สำเร็จ');
    } catch (error) {
      toast.error('ไม่สามารถดาวน์โหลด CSV ได้');
    }
  };

  const getActionBadgeClass = (action: string) => {
    const classes: Record<string, string> = {
      CREATE_USER: 'create',
      UPDATE_USER: 'update',
      DELETE_USER: 'delete',
      SUSPEND_USER: 'review',
      ACTIVATE_USER: 'create',
      CHANGE_ROLE: 'assign',
      UPLOAD_GEOJSON: 'update',
      EDIT_POLYGON: 'update',
      DELETE_GEOJSON: 'delete',
      UPDATE_SETTINGS: 'update',
      RESET_SETTINGS: 'review',
      LOGIN: 'login',
      LOGOUT: 'logout'
    };
    return classes[action] || 'login';
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      CREATE_USER: 'สร้างผู้ใช้',
      UPDATE_USER: 'แก้ไขผู้ใช้',
      DELETE_USER: 'ลบผู้ใช้',
      SUSPEND_USER: 'ระงับผู้ใช้',
      ACTIVATE_USER: 'เปิดใช้งานผู้ใช้',
      CHANGE_ROLE: 'เปลี่ยนบทบาท',
      UPLOAD_GEOJSON: 'อัพโหลด GeoJSON',
      EDIT_POLYGON: 'แก้ไข Polygon',
      DELETE_GEOJSON: 'ลบ GeoJSON',
      UPDATE_SETTINGS: 'อัพเดทการตั้งค่า',
      RESET_SETTINGS: 'รีเซ็ตการตั้งค่า',
      LOGIN: 'เข้าสู่ระบบ',
      LOGOUT: 'ออกจากระบบ'
    };
    return labels[action] || action;
  };

  return (
    <div>
      {/* Filters */}
      <div className="filters-card">
        <h2>🔍 ค้นหาและกรองข้อมูล</h2>
        <div className="filter-row">
          <div className="filter-group">
            <label>การกระทำ</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="">ทุกการกระทำ</option>
              <option value="CREATE_USER">สร้างผู้ใช้</option>
              <option value="UPDATE_USER">แก้ไขผู้ใช้</option>
              <option value="DELETE_USER">ลบผู้ใช้</option>
              <option value="SUSPEND_USER">ระงับผู้ใช้</option>
              <option value="ACTIVATE_USER">เปิดใช้งานผู้ใช้</option>
              <option value="CHANGE_ROLE">เปลี่ยนบทบาท</option>
              <option value="UPLOAD_GEOJSON">อัพโหลด GeoJSON</option>
              <option value="EDIT_POLYGON">แก้ไข Polygon</option>
              <option value="DELETE_GEOJSON">ลบ GeoJSON</option>
              <option value="UPDATE_SETTINGS">อัพเดทการตั้งค่า</option>
            </select>
          </div>

          <div className="filter-group">
            <label>ประเภทเป้าหมาย</label>
            <select
              value={targetTypeFilter}
              onChange={(e) => setTargetTypeFilter(e.target.value)}
            >
              <option value="">ทุกประเภท</option>
              <option value="USER">ผู้ใช้</option>
              <option value="GEOJSON">GeoJSON</option>
              <option value="SETTINGS">การตั้งค่า</option>
            </select>
          </div>

          <div className="filter-group">
            <label>วันที่เริ่มต้น</label>
            <ThaiDatePicker
              id="audit-start-date"
              value={startDate}
              onChange={setStartDate}
              placeholder="เลือกวันเริ่มต้น"
            />
          </div>

          <div className="filter-group">
            <label>วันที่สิ้นสุด</label>
            <ThaiDatePicker
              id="audit-end-date"
              value={endDate}
              onChange={setEndDate}
              placeholder="เลือกวันสิ้นสุด"
            />
          </div>
        </div>

        <div className="filter-actions">
          <button
            className="btn-reset"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            🔄 รีโหลด
          </button>
          <button
            className="btn-export"
            onClick={handleExportCSV}
          >
            ⬇️ Export CSV
          </button>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="empty-state">
          <div className="empty-icon">❌</div>
          <p className="empty-text">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
          <p className="empty-hint">กรุณาลองใหม่อีกครั้ง</p>
        </div>
      )}

      {/* Table */}
      <div className="logs-card">
        <div className="logs-header">
          <h2>📋 รายการกิจกรรม</h2>
          <span className="logs-count">ทั้งหมด {data?.total || 0} รายการ</span>
        </div>

        <div className="logs-table-wrapper">
          <table className="logs-table">
            <thead>
              <tr>
                <th>เวลา</th>
                <th>ผู้ใช้</th>
                <th>การกระทำ</th>
                <th>เป้าหมาย</th>
                <th>IP Address</th>
                <th>รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="loading-state">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">กำลังโหลดข้อมูล...</p>
                  </td>
                </tr>
              ) : !data?.data || data.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state-cell">
                    <div className="empty-icon">📝</div>
                    <p className="empty-text">ไม่พบข้อมูลกิจกรรม</p>
                  </td>
                </tr>
              ) : (
                data.data.map((log: AuditLog) => (
                  <tr key={log.id}>
                    <td className="log-time">
                      <div className="log-date">
                        {new Date(log.createdAt).toLocaleDateString('th-TH')}
                      </div>
                      <div className="log-clock">
                        {new Date(log.createdAt).toLocaleTimeString('th-TH')}
                      </div>
                    </td>
                    <td className="log-user">
                      <div className="user-name">{log.username}</div>
                      <div className="user-details">{log.userId.substring(0, 8)}...</div>
                    </td>
                    <td className="log-action">
                      <span className={`action-badge ${getActionBadgeClass(log.action)}`}>
                        {getActionLabel(log.action)}
                      </span>
                    </td>
                    <td className="log-incident">
                      {log.targetType && (
                        <div>
                          <div className="incident-title">{log.targetType}</div>
                          {log.targetId && (
                            <div className="incident-id">{log.targetId.substring(0, 8)}...</div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="text-center">
                      <span className="incident-id">{log.ipAddress || '-'}</span>
                    </td>
                    <td className="log-details">
                      {log.details ? (
                        <div className="details-json" title={JSON.stringify(log.details, null, 2)}>
                          {JSON.stringify(log.details)}
                        </div>
                      ) : (
                        <span className="details-empty">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              &lt; ก่อนหน้า
            </button>
            <span className="pagination-info">
              หน้า {data.page} จาก {data.totalPages}
            </span>
            <button
              className="pagination-button"
              onClick={() => setPage(page + 1)}
              disabled={page === data.totalPages}
            >
              ถัดไป &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogTable;
