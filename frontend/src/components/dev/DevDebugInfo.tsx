import React, { useState, useEffect } from 'react';
import { apiLogger } from '../../utils/apiInterceptor';
import type { ApiLogEntry } from '../../utils/apiInterceptor';
import { useIsDeveloper } from '../../context/RoleContext';

/**
 * Developer Debug Info Component
 * 
 * Displays API request/response logs and statistics for development purposes.
 * Only visible when user has DEVELOPER role.
 */
export const DevDebugInfo: React.FC = () => {
  const isDeveloper = useIsDeveloper();
  const [logs, setLogs] = useState<ApiLogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ApiLogEntry | null>(null);
  const [filter, setFilter] = useState<'all' | 'success' | 'error'>('all');

  // Subscribe to log updates
  useEffect(() => {
    const unsubscribe = apiLogger.subscribe((newLogs) => {
      setLogs(newLogs);
    });

    // Initial load
    setLogs(apiLogger.getLogs());

    return unsubscribe;
  }, []);

  // Don't render if not a developer
  if (!isDeveloper) {
    return null;
  }

  const stats = apiLogger.getStats();

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    if (filter === 'success') {
      return log.status && log.status >= 200 && log.status < 400;
    }
    if (filter === 'error') {
      return log.error || (log.status && Number(log.status) >= 400);
    }
    return true;
  });

  const getStatusColor = (status?: number) => {
    if (!status) return 'text-gray-500';
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 300 && status < 400) return 'text-blue-600';
    if (status >= 400 && status < 500) return 'text-orange-600';
    return 'text-red-600';
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'bg-blue-100 text-blue-800',
      POST: 'bg-green-100 text-green-800',
      PUT: 'bg-yellow-100 text-yellow-800',
      PATCH: 'bg-purple-100 text-purple-800',
      DELETE: 'bg-red-100 text-red-800',
    };
    return colors[method] || 'bg-gray-100 text-gray-800';
  };

  const formatDuration = (ms?: number) => {
    if (ms === undefined) return '-';
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });
  };

  return (
    <>
      {/* Floating Debug Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
      >
        <span>🐛</span>
        <span className="font-medium">Debug</span>
        {stats.totalRequests > 0 && (
          <span className="bg-white text-yellow-800 px-2 py-0.5 rounded-full text-xs font-bold">
            {stats.totalRequests}
          </span>
        )}
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <span>🐛</span>
                    <span>API Debug Info</span>
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Real-time API request/response monitoring
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                >
                  ✕ ปิด
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {stats.totalRequests}
                  </div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.successCount}
                  </div>
                  <div className="text-xs text-gray-600">Success</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {stats.errorCount}
                  </div>
                  <div className="text-xs text-gray-600">Errors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatDuration(stats.avgDuration)}
                  </div>
                  <div className="text-xs text-gray-600">Avg Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatDuration(stats.minDuration)}
                  </div>
                  <div className="text-xs text-gray-600">Min Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatDuration(stats.maxDuration)}
                  </div>
                  <div className="text-xs text-gray-600">Max Time</div>
                </div>
              </div>
            </div>

            {/* Filters and Actions */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    filter === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All ({logs.length})
                </button>
                <button
                  onClick={() => setFilter('success')}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    filter === 'success'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Success ({stats.successCount})
                </button>
                <button
                  onClick={() => setFilter('error')}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    filter === 'error'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Errors ({stats.errorCount})
                </button>
              </div>
              <button
                onClick={() => {
                  apiLogger.clearLogs();
                  setSelectedLog(null);
                }}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                🗑️ Clear Logs
              </button>
            </div>

            {/* Logs List */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📭</div>
                  <div>No API logs yet</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className={`p-3 border rounded cursor-pointer transition-colors ${
                        selectedLog?.id === log.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded ${getMethodColor(
                              log.method
                            )}`}
                          >
                            {log.method}
                          </span>
                          <span className="text-sm text-gray-800 truncate">
                            {log.url}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {log.status && (
                            <span
                              className={`text-sm font-medium ${getStatusColor(
                                log.status
                              )}`}
                            >
                              {log.status}
                            </span>
                          )}
                          <span className="text-sm text-gray-600">
                            {formatDuration(log.duration)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(log.timestamp)}
                          </span>
                        </div>
                      </div>
                      {log.error && (
                        <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                          ❌ {log.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Log Details */}
            {selectedLog && (
              <div className="border-t border-gray-200 p-4 bg-gray-50 max-h-64 overflow-y-auto">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Request/Response Details
                </h3>
                <div className="space-y-2">
                  {selectedLog.requestData && (
                    <div>
                      <div className="text-xs font-medium text-gray-600 mb-1">
                        Request:
                      </div>
                      <pre className="text-xs bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                        {JSON.stringify(selectedLog.requestData, null, 2)}
                      </pre>
                    </div>
                  )}
                  {selectedLog.responseData && (
                    <div>
                      <div className="text-xs font-medium text-gray-600 mb-1">
                        Response:
                      </div>
                      <pre className="text-xs bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                        {typeof selectedLog.responseData === 'string'
                          ? selectedLog.responseData
                          : JSON.stringify(selectedLog.responseData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DevDebugInfo;
