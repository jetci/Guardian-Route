import React, { useState, useMemo } from 'react';
import { useApiLog } from '../context/ApiLogContext';
import type { ApiLogEntry } from '../context/ApiLogContext';
import { useRole } from '../context/RoleContext';
import { Code, X, ChevronDown, ChevronUp, RefreshCw, Filter, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

// --- Helper Components ---

const LogDetail: React.FC<{ log: ApiLogEntry }> = ({ log }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusColor = (status: number | 'PENDING') => {
    if (status === 'PENDING') return 'text-yellow-500';
    if (status >= 200 && status < 300) return 'text-green-500';
    if (status >= 400) return 'text-red-500';
    return 'text-gray-500';
  };

  const renderJson = (data: any) => {
    if (!data) return <pre className="text-gray-500">N/A</pre>;
    try {
      return (
        <pre className="whitespace-pre-wrap break-all text-xs bg-gray-800 p-2 rounded-md text-green-300">
          {JSON.stringify(data, null, 2)}
        </pre>
      );
    } catch {
      return <pre className="text-xs text-red-400">Invalid JSON</pre>;
    }
  };

  return (
    <div className="border-b border-gray-700">
      <div
        className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-800 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3 w-full">
          <span className={`font-bold text-xs w-12 text-center ${getStatusColor(log.status)}`}>
            {log.status}
          </span>
          <span className={`font-mono text-xs w-16 ${log.method === 'POST' ? 'text-yellow-400' : 'text-blue-400'}`}>
            {log.method}
          </span>
          <span className="text-xs text-gray-300 truncate flex-1">{log.url}</span>
          <span className="text-xs text-gray-400 w-16 text-right">
            {log.duration !== null ? `${log.duration.toFixed(0)}ms` : '-'}
          </span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400 ml-2" /> : <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />}
      </div>

      {isOpen && (
        <div className="p-3 bg-gray-900 space-y-3">
          <div className="text-sm font-semibold text-gray-300">Request Data:</div>
          {renderJson(log.requestData)}

          <div className="text-sm font-semibold text-gray-300">Response Data:</div>
          {log.error ? (
            <div className="text-xs text-red-400 bg-gray-800 p-2 rounded-md">
              Error: {log.error}
              {log.responseData && (
                <>
                  <div className="mt-2 font-semibold">Response Body:</div>
                  {renderJson(log.responseData)}
                </>
              )}
            </div>
          ) : (
            renderJson(log.responseData)
          )}
        </div>
      )}
    </div>
  );
};

// --- Main Component ---

type FilterType = 'ALL' | 'SUCCESS' | 'ERROR' | 'PENDING';

const DevDebugPanel: React.FC = () => {
  const { isDeveloper } = useRole();
  const { logs, clearLogs } = useApiLog();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('ALL');

  // Do not render if not a developer
  if (!isDeveloper) {
    return null;
  }

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (filter === 'ALL') return true;
      if (filter === 'PENDING') return log.status === 'PENDING';
      if (filter === 'SUCCESS') return Number(log.status) >= 200 && Number(log.status) < 400;
      if (filter === 'ERROR') return Number(log.status) >= 400 || log.error !== null || Number(log.status) === 0;
      return true;
    });
  }, [logs, filter]);

  const errorCount = logs.filter(log => Number(log.status) >= 400 || log.error !== null || Number(log.status) === 0).length;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 p-3 rounded-full shadow-lg transition-all duration-300 z-50 ${
          isOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
        } text-white`}
        title={isOpen ? 'Close Debug Panel' : 'Open Debug Panel'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Code className="w-6 h-6" />}
        {errorCount > 0 && !isOpen && (
          <span className="absolute top-0 right-0 block h-3 w-3 transform -translate-y-1/2 translate-x-1/2 rounded-full ring-2 ring-white bg-red-500" />
        )}
      </button>

      {/* Debug Panel Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-1/3 bg-gray-900 text-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold flex items-center">
            <Code className="w-5 h-5 mr-2 text-indigo-400" />
            API Debug Console ({logs.length})
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={clearLogs}
              className="p-1 rounded-full hover:bg-gray-700 transition-colors"
              title="Clear Logs"
            >
              <RefreshCw className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-gray-700 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Filter and Stats */}
        <div className="p-4 border-b border-gray-700 flex flex-wrap gap-2">
          {(['ALL', 'SUCCESS', 'ERROR', 'PENDING'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors flex items-center space-x-1 ${
                filter === f
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {f === 'ALL' && <Filter className="w-3 h-3" />}
              {f === 'SUCCESS' && <CheckCircle className="w-3 h-3 text-green-300" />}
              {f === 'ERROR' && <AlertTriangle className="w-3 h-3 text-red-300" />}
              {f === 'PENDING' && <Clock className="w-3 h-3 text-yellow-300" />}
              <span>{f}</span>
              {f === 'ERROR' && errorCount > 0 && (
                <span className="ml-1 bg-red-600 px-1 rounded-full">{errorCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Log List */}
        <div className="h-[calc(100%-120px)] overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {logs.length === 0 ? 'No API calls logged yet.' : 'No logs match the current filter.'}
            </div>
          ) : (
            filteredLogs.map((log) => <LogDetail key={log.id} log={log} />)
          )}
        </div>
      </div>
    </>
  );
};

export default DevDebugPanel;
