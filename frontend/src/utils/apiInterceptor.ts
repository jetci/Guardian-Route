/**
 * API Log Entry Interface
 */
export interface ApiLogEntry {
  id: string;
  timestamp: number;
  method: string;
  url: string;
  status?: number;
  duration?: number;
  requestData?: any;
  responseData?: any;
  error?: string;
}

/**
 * API Logger Class
 * Manages API request/response logging for development
 */
class ApiLogger {
  private logs: ApiLogEntry[] = [];
  private maxLogs = 100; // Keep last 100 logs
  private listeners: Set<(logs: ApiLogEntry[]) => void> = new Set();

  /**
   * Log API request
   */
  logRequest(method: string, url: string, data?: any): string {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const entry: ApiLogEntry = {
      id,
      timestamp: Date.now(),
      method: method.toUpperCase(),
      url,
      requestData: data,
    };

    this.addLog(entry);
    return id;
  }

  /**
   * Log API response
   */
  logResponse(id: string, status: number, data?: any, error?: string) {
    const log = this.logs.find((l) => l.id === id);
    
    if (log) {
      log.status = status;
      log.duration = Date.now() - log.timestamp;
      log.responseData = data;
      log.error = error;
      this.notifyListeners();
    }
  }

  /**
   * Add log entry
   */
  private addLog(entry: ApiLogEntry) {
    this.logs.unshift(entry);
    
    // Keep only last N logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
    
    this.notifyListeners();
  }

  /**
   * Get all logs
   */
  getLogs(): ApiLogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = [];
    this.notifyListeners();
  }

  /**
   * Subscribe to log updates
   */
  subscribe(callback: (logs: ApiLogEntry[]) => void): () => void {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners() {
    this.listeners.forEach((callback) => {
      callback(this.getLogs());
    });
  }

  /**
   * Get statistics
   */
  getStats() {
    const logs = this.logs.filter((log) => log.duration !== undefined);
    
    if (logs.length === 0) {
      return {
        totalRequests: 0,
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        errorCount: 0,
        successCount: 0,
      };
    }

    const durations = logs.map((log) => log.duration!);
    const errorCount = logs.filter((log) => log.error || (log.status && log.status >= 400)).length;
    
    return {
      totalRequests: logs.length,
      avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      errorCount,
      successCount: logs.length - errorCount,
    };
  }
}

// Singleton instance
export const apiLogger = new ApiLogger();

/**
 * Fetch interceptor wrapper
 * Wraps native fetch to log all API calls
 */
export const createFetchInterceptor = () => {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const [url, options = {}] = args;
    const method = options.method || 'GET';
    
    // Log request
    const logId = apiLogger.logRequest(
      method,
      typeof url === 'string' ? url : url.toString(),
      options.body
    );

    try {
      // const startTime = Date.now(); // Unused variable
      const response = await originalFetch(...args);
      // const duration = Date.now() - startTime; // Unused variable

      // Clone response to read body
      const clonedResponse = response.clone();
      let responseData;
      
      try {
        responseData = await clonedResponse.json();
      } catch {
        // Response is not JSON
        responseData = await clonedResponse.text();
      }

      // Log response
      apiLogger.logResponse(
        logId,
        response.status,
        responseData,
        response.ok ? undefined : `HTTP ${response.status}`
      );

      return response;
    } catch (error) {
      // Log error
      apiLogger.logResponse(
        logId,
        0,
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      
      throw error;
    }
  };

  // Return cleanup function
  return () => {
    window.fetch = originalFetch;
  };
};

/**
 * Initialize API interceptor
 * Call this once when app starts (only in development mode)
 */
export const initApiInterceptor = () => {
  if (import.meta.env.DEV || localStorage.getItem('dev_mode') === 'true') {
    console.log('[DEV] API Interceptor initialized');
    return createFetchInterceptor();
  }
  
  return () => {}; // No-op cleanup
};
