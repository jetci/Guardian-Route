import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ReportDetails } from '../components/reports';
import { ReportType, ReportStatus } from '../types/Report';
import type { Report } from '../types/Report';
import { getReportById } from '../api/reports';
import { incidentService } from '../services/incidentService';
import { villagesApi } from '../api/villages';
import { useAuthStore } from '../stores/authStore';
import { IncidentStatus } from '../types';

const ReportDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadReport();
    }
  }, [id]);

  const loadReport = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching report with ID:', id);
      // Try fetching as Report first
      const data = await getReportById(id);
      console.log('Found Report:', data);
      setReport(data);
    } catch (err: any) {
      // If Report not found, try fetching as Incident
      try {
        console.log('Report not found, trying to fetch as Incident...', id);
        const incident = await incidentService.getById(id);
        console.log('Incident fetch result:', incident);



        // ... inside loadReport ...

        if (incident) {
          // Check if village data is missing but villageId exists
          if (!incident.village && incident.villageId) {
            try {
              console.log('Fetching missing village data for:', incident.villageId);
              const villageData = await villagesApi.getById(incident.villageId);
              incident.village = villageData;
              console.log('Fetched village data:', villageData);
            } catch (vErr) {
              console.error('Failed to fetch village data:', vErr);
            }
          }

          // Extract markers from affectedArea if available
          let markers: any[] = [];
          let polygonGeoJson = incident.affectedArea;

          if (incident.affectedArea && incident.affectedArea.features) {
            // Extract Points
            markers = incident.affectedArea.features
              .filter((f: any) => f.geometry.type === 'Point')
              .map((f: any) => ({
                lat: f.geometry.coordinates[1],
                lng: f.geometry.coordinates[0],
                label: f.properties?.label || `จุดที่ ${f.properties?.number || '?'}`
              }));

            // Filter out Points from affectedArea for display (so we don't get duplicate markers)
            const polygonFeatures = incident.affectedArea.features
              .filter((f: any) => f.geometry.type !== 'Point');

            if (polygonFeatures.length > 0) {
              polygonGeoJson = {
                ...incident.affectedArea,
                features: polygonFeatures
              };
            } else {
              polygonGeoJson = null;
            }
          }

          // Fallback: If no markers found in affectedArea, try to parse from description
          if (markers.length === 0 && incident.description) {
            try {
              // Regex to match "1. 19.961248, 99.228687" pattern
              const regex = /(\d+)\.\s*(\d+\.\d+),\s*(\d+\.\d+)/g;
              let match;
              while ((match = regex.exec(incident.description)) !== null) {
                markers.push({
                  label: `จุดที่ ${match[1]}`,
                  lat: parseFloat(match[2]),
                  lng: parseFloat(match[3])
                });
              }
              if (markers.length > 0) {
                console.log('Extracted markers from description:', markers);
              }
            } catch (e) {
              console.warn('Failed to parse markers from description:', e);
            }
          }

          // Map Incident to Report structure
          const mappedReport: Report = {
            id: incident.id,
            type: ReportType.INCIDENT,
            status: mapIncidentStatusToReportStatus(incident.status),
            title: incident.title,
            summary: incident.description,
            incident: {
              ...incident,
              affectedArea: polygonGeoJson // Use filtered polygon for the map
            },
            village: incident.village, // Map village object for boundary display
            author: incident.createdBy || {
              id: 'unknown',
              firstName: 'Unknown',
              lastName: 'User',
              role: 'FIELD_OFFICER',
              email: ''
            }, // Fallback if createdBy is missing
            authorId: incident.createdBy?.id || 'unknown',
            createdAt: incident.createdAt,
            updatedAt: incident.updatedAt,
            photoUrls: incident.images || [],
            details: {
              gpsLocation: incident.location,
              disasterType: incident.disasterType,
              severity: incident.severity, // Assuming severity exists in response
              address: incident.address,
              villageName: incident.village?.name,
              polygon: polygonGeoJson,
              additionalData: {
                incidentDate: incident.createdAt,
                locationName: incident.address,
                markers: markers
              }
            },
            // Default values for required fields
            submittedAt: incident.createdAt,
          };
          console.log('Mapped Report:', mappedReport);
          setReport(mappedReport);
        } else {
          throw new Error('Incident not found');
        }
      } catch (incidentErr) {
        console.error('Failed to load as incident:', incidentErr);
        setError('ไม่พบรายงานหรือเหตุการณ์นี้');
      }
    } finally {
      setLoading(false);
    }
  };

  const mapIncidentStatusToReportStatus = (status: IncidentStatus): ReportStatus => {
    switch (status) {
      case IncidentStatus.PENDING:
        return ReportStatus.SUBMITTED;
      case IncidentStatus.INVESTIGATING:
      case IncidentStatus.IN_PROGRESS:
        return ReportStatus.UNDER_REVIEW;
      case IncidentStatus.RESOLVED:
      case IncidentStatus.CLOSED:
        return ReportStatus.APPROVED;
      case IncidentStatus.REJECTED:
        return ReportStatus.REJECTED;
      default:
        return ReportStatus.SUBMITTED;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-300 text-red-800 px-6 py-4 rounded-xl shadow-md">
            {error || 'Report not found'}
          </div>
          <div className="mt-4">
            <Link
              to="/report-history"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← กลับไปหน้าประวัติการรายงาน
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Combined Header - Single Line */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
            {/* Left: Back Button */}
            <Link
              to="/report-history"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 hover:text-blue-600 font-medium transition-all group flex-shrink-0"
            >
              <svg
                className="h-5 w-5 transition-transform group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>ประวัติการรายงาน</span>
            </Link>

            {/* Center: Report Title */}
            <div className="flex-1 min-w-0 px-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl flex-shrink-0">📋</span>
                <h1 className="text-xl font-bold text-gray-900 truncate">{report.title}</h1>
              </div>
            </div>

            {/* Right: Status & Date */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${report.status === 'APPROVED' ? 'bg-green-500 text-white' :
                  report.status === 'REJECTED' ? 'bg-red-500 text-white' :
                    report.status === 'REVISION_REQUIRED' ? 'bg-orange-500 text-white' :
                      'bg-blue-500 text-white'
                }`}>
                {report.status === 'APPROVED' ? '✓ อนุมัติแล้ว' :
                  report.status === 'REJECTED' ? '✕ ปฏิเสธ' :
                    report.status === 'REVISION_REQUIRED' ? '⚠ ต้องแก้ไข' :
                      report.status === 'UNDER_REVIEW' ? '⏳ รอตรวจสอบ' :
                        report.status === 'SUBMITTED' ? '📤 ส่งแล้ว' :
                          report.status === 'DRAFT' ? '📝 แบบร่าง' : report.status}
              </span>
              <span className="text-sm text-gray-600">
                {new Date(report.createdAt).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Report Details */}
        <ReportDetails
          report={report}
          currentUser={user}
          onUpdate={loadReport}
        />

        {/* Modern Back Button */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/report-history"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 font-semibold transition-all shadow-md hover:shadow-lg group"
          >
            <svg
              className="h-5 w-5 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            กลับไปหน้าประวัติการรายงาน
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsPage;
