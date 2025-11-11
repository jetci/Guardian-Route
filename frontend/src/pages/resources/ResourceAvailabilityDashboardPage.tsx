import React, { useState } from 'react';
// import { useResources } from '../../hooks/resources/useResources';
import { useResourceEvents } from '../../hooks/resources/useResourceEvents';
import type { ResourceEvent } from '../../hooks/resources/useResourceEvents';
import { ResourceSummaryCards } from '../../components/resources/ResourceSummaryCards';
import { RealTimeResourceTable } from '../../components/resources/RealTimeResourceTable';
import type { Resource } from '../../types/resource';

export const ResourceAvailabilityDashboardPage: React.FC = () => {
  const resources: Resource[] = []; const loading = false; const error = null; const refetch = () => {};
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Handle SSE events
  const handleResourceEvent = (event: ResourceEvent) => {
    console.log('Resource event received:', event);

    // Refresh data
    refetch();
    setLastUpdate(new Date());

    // Show toast notification
    let message = '';
    switch (event.type) {
      case 'resource.created':
        message = `เพิ่มทรัพยากรใหม่: ${(event.data as Resource).name}`;
        break;
      case 'resource.updated':
        message = `อัปเดตทรัพยากร: ${(event.data as Resource).name}`;
        break;
      case 'resource.deleted':
        message = `ลบทรัพยากรแล้ว`;
        break;
      case 'resource.allocated':
        message = `มอบหมายทรัพยากรแล้ว`;
        break;
      case 'resource.reclaimed':
        message = `คืนทรัพยากรแล้ว`;
        break;
    }

    if (message) {
      setToastMessage(message);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const { isConnected } = useResourceEvents({
    onEvent: handleResourceEvent,
    onConnect: () => {
      console.log('Connected to resource events');
    },
    onDisconnect: () => {
      console.log('Disconnected from resource events');
    },
    onError: (error) => {
      console.error('Resource events error:', error);
    },
  });

  const handleRefresh = () => {
    refetch();
    setLastUpdate(new Date());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ติดตามทรัพยากรแบบเรียลไทม์
              </h1>
              <p className="text-gray-600 mt-1">
                ระบบแสดงสถานะและความพร้อมใช้งานของทรัพยากรแบบเรียลไทม์
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'เชื่อมต่อแล้ว' : 'ไม่ได้เชื่อมต่อ'}
                </span>
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                รีเฟรช
              </button>
            </div>
          </div>

          {/* Last Update */}
          <p className="text-sm text-gray-500 mt-2">
            อัปเดตล่าสุด: {lastUpdate.toLocaleString('th-TH')}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-600 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-red-800 font-medium">เกิดข้อผิดพลาด</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <ResourceSummaryCards resources={resources} loading={loading} />

        {/* Resource Table */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            รายการทรัพยากรทั้งหมด
          </h2>
          <RealTimeResourceTable resources={resources} loading={loading} />
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
