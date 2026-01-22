import { useState, useEffect } from 'react';
import { incidentsApi } from '../../api/incidents';
import type { Incident, IncidentStatus, Priority, DisasterType } from '../../types';
import IncidentDetailsModal from './IncidentDetailsModal';
import { AssignIncidentModal } from '../supervisor/AssignIncidentModal';
import { ReviewIncidentModal } from '../supervisor/ReviewIncidentModal';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

export const IncidentsList = ({ refreshKey }: { refreshKey: number }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [listRefreshKey, setListRefreshKey] = useState(0);
  const [filters, setFilters] = useState({
    status: '' as IncidentStatus | '',
    priority: '' as Priority | '',
    disasterType: '' as DisasterType | '',
  });
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    loadIncidents();
  }, [filters, refreshKey, listRefreshKey]);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const data = await incidentsApi.getAll({
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        disasterType: filters.disasterType || undefined,
      });
      setIncidents(data);
    } catch (error) {
      console.error('Error loading incidents:', error);
      toast.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const handleIncidentUpdate = () => {
    setListRefreshKey(prev => prev + 1);
  };

  const handleAssignClick = (incident: Incident) => {
    setSelectedIncident(incident);
    setAssignModalOpen(true);
  };

  const handleReviewClick = (incident: Incident) => {
    setSelectedIncident(incident);
    setReviewModalOpen(true);
  };

  const handleAssignSuccess = () => {
    setListRefreshKey(prev => prev + 1);
  };

  const handleReviewSuccess = () => {
    setListRefreshKey(prev => prev + 1);
  };

  const isSupervisor = user?.role === 'SUPERVISOR' || user?.role === 'ADMIN';

  const getStatusBadge = (status: IncidentStatus) => {
    const badges: Record<IncidentStatus, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      RESOLVED: 'bg-green-100 text-green-800',
      CLOSED: 'bg-gray-100 text-gray-800',
    };
    const labels: Record<IncidentStatus, string> = {
      PENDING: 'รอดำเนินการ',
      IN_PROGRESS: 'กำลังดำเนินการ',
      RESOLVED: 'แก้ไขแล้ว',
      CLOSED: 'ปิดงาน',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPriorityBadge = (priority: Priority) => {
    const badges = {
      LOW: 'bg-gray-100 text-gray-800',
      MEDIUM: 'bg-blue-100 text-blue-800',
      HIGH: 'bg-orange-100 text-orange-800',
      CRITICAL: 'bg-red-100 text-red-800',
    };
    const labels = {
      LOW: 'ต่ำ',
      MEDIUM: 'ปานกลาง',
      HIGH: 'สูง',
      CRITICAL: 'วิกฤต',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[priority]}`}>
        {labels[priority]}
      </span>
    );
  };

  const getDisasterTypeLabel = (type: DisasterType) => {
    const labels = {
      FLOOD: 'น้ำท่วม',
      LANDSLIDE: 'ดินถล่ม',
      FIRE: 'ไฟไหม้',
      STORM: 'พายุ',
      EARTHQUAKE: 'แผ่นดินไหว',
      OTHER: 'อื่นๆ',
    };
    return labels[type];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <IncidentDetailsModal
        incidentId={selectedIncidentId}
        isOpen={!!selectedIncidentId}
        onClose={() => setSelectedIncidentId(null)}
        onUpdate={handleIncidentUpdate}
      />
      <AssignIncidentModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        incident={selectedIncident}
        onSuccess={handleAssignSuccess}
      />
      <ReviewIncidentModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        incident={selectedIncident}
        onSuccess={handleReviewSuccess}
      />
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">ตัวกรอง</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              สถานะ
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as IncidentStatus | '' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">ทั้งหมด</option>
              <option value="PENDING">รอดำเนินการ</option>
              <option value="IN_PROGRESS">กำลังดำเนินการ</option>
              <option value="RESOLVED">แก้ไขแล้ว</option>
              <option value="CLOSED">ปิดงาน</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ความสำคัญ
            </label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value as Priority | '' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">ทั้งหมด</option>
              <option value="LOW">ต่ำ</option>
              <option value="MEDIUM">ปานกลาง</option>
              <option value="HIGH">สูง</option>
              <option value="CRITICAL">วิกฤต</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ประเภทภัย
            </label>
            <select
              value={filters.disasterType}
              onChange={(e) => setFilters({ ...filters, disasterType: e.target.value as DisasterType | '' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">ทั้งหมด</option>
              <option value="FLOOD">น้ำท่วม</option>
              <option value="LANDSLIDE">ดินถล่ม</option>
              <option value="FIRE">ไฟไหม้</option>
              <option value="STORM">พายุ</option>
              <option value="EARTHQUAKE">แผ่นดินไหว</option>
              <option value="OTHER">อื่นๆ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-base font-medium text-gray-700">
        พบ {incidents.length} รายการ
      </div>

      {/* Incidents List */}
      {incidents.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center text-xl text-gray-500 border border-gray-100">
          ไม่พบข้อมูลเหตุการณ์
        </div>
      ) : (
        <div className="space-y-3">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {incident.title}
                    </h3>
                    {getStatusBadge(incident.status)}
                    {getPriorityBadge(incident.priority)}
                  </div>

                  {incident.description && (
                    <p className="text-gray-700 text-base mb-2">
                      {incident.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">ประเภท:</span>{' '}
                      {getDisasterTypeLabel(incident.disasterType)}
                    </div>
                    {incident.village && (
                      <div>
                        <span className="font-medium">หมู่บ้าน:</span>{' '}
                        {incident.village.name}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">รายงานโดย:</span>{' '}
                      {incident.createdBy.firstName} {incident.createdBy.lastName}
                    </div>
                    <div>
                      <span className="font-medium">เวลา:</span>{' '}
                      {formatDate(incident.createdAt)}
                    </div>
                  </div>

                  {incident._count && (
                    <div className="flex gap-6 mt-3 text-sm text-gray-600 font-medium">
                      <div>งาน: {incident._count.tasks}</div>
                      <div>สำรวจ: {incident._count.surveys}</div>
                      <div>รายงาน: {incident._count.reports}</div>
                    </div>
                  )}

                  {/* Images Preview */}
                  {incident.images && incident.images.length > 0 && (
                    <div className="mt-3">
                      <div className="flex gap-2 overflow-x-auto">
                        {incident.images.slice(0, 3).map((url, idx) => (
                          <img
                            key={idx}
                            src={`${(import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '')}${url}`}
                            alt={`Image ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
                          />
                        ))}
                        {incident.images.length > 3 && (
                          <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-gray-300 text-base text-gray-600 font-semibold">
                            +{incident.images.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    className="px-4 py-2 text-base text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-colors border border-blue-200"
                    onClick={() => setSelectedIncidentId(incident.id)}
                  >
                    ดูรายละเอียด
                  </button>
                  {isSupervisor && incident.status === 'PENDING' && (
                    <>
                      <button
                        className="px-4 py-2 text-base text-green-600 hover:bg-green-50 rounded-xl font-medium transition-colors border border-green-200"
                        onClick={() => handleAssignClick(incident)}
                      >
                        มอบหมาย
                      </button>
                      <button
                        className="px-4 py-2 text-base text-purple-600 hover:bg-purple-50 rounded-xl font-medium transition-colors border border-purple-200"
                        onClick={() => handleReviewClick(incident)}
                      >
                        ตรวจสอบ
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
