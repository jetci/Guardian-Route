import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export interface GPSCoordinates {
  lat: number;
  lng: number;
  accuracy?: number;
  altitude?: number;
  timestamp?: number;
}

export interface GPSError {
  code: number;
  message: string;
  type: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'NOT_SUPPORTED';
}

export interface UseGPSOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  autoStart?: boolean;
  onSuccess?: (position: GPSCoordinates) => void;
  onError?: (error: GPSError) => void;
}

/**
 * Custom hook for GPS/Geolocation with comprehensive error handling
 * 
 * Features:
 * - Permission handling
 * - Timeout handling
 * - Position unavailable handling
 * - Browser support detection
 * - Auto-retry option
 * - Watch position (continuous tracking)
 * 
 * @example
 * const { position, error, loading, getCurrentPosition } = useGPS({
 *   enableHighAccuracy: true,
 *   timeout: 10000,
 *   onSuccess: (pos) => console.log('Got position:', pos),
 *   onError: (err) => console.error('GPS error:', err)
 * });
 */
export function useGPS(options: UseGPSOptions = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    autoStart = false,
    onSuccess,
    onError
  } = options;

  const [position, setPosition] = useState<GPSCoordinates | null>(null);
  const [error, setError] = useState<GPSError | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  // Check GPS support on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setIsSupported(false);
      const err: GPSError = {
        code: 0,
        message: 'เบราว์เซอร์ไม่รองรับ GPS',
        type: 'NOT_SUPPORTED'
      };
      setError(err);
      onError?.(err);
      toast.error('เบราว์เซอร์ไม่รองรับ GPS กรุณาใช้เบราว์เซอร์ที่รองรับ');
    }
  }, [onError]);

  /**
   * Get current GPS position (one-time)
   */
  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('เบราว์เซอร์ไม่รองรับ GPS');
      return;
    }

    setLoading(true);
    setError(null);

    const successHandler = (pos: GeolocationPosition) => {
      const coords: GPSCoordinates = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        altitude: pos.coords.altitude || undefined,
        timestamp: pos.timestamp
      };

      setPosition(coords);
      setLoading(false);
      onSuccess?.(coords);
      
      const accuracyText = coords.accuracy 
        ? `ความแม่นยำ: ${Math.round(coords.accuracy)} เมตร` 
        : '';
      
      toast.success(
        `📍 ได้รับตำแหน่ง GPS แล้ว ${accuracyText}`,
        { duration: 3000 }
      );
    };

    const errorHandler = (err: GeolocationPositionError) => {
      let gpsError: GPSError;

      switch (err.code) {
        case err.PERMISSION_DENIED:
          gpsError = {
            code: err.code,
            message: 'ผู้ใช้ปฏิเสธการเข้าถึง GPS',
            type: 'PERMISSION_DENIED'
          };
          toast.error(
            '❌ กรุณาอนุญาตการเข้าถึงตำแหน่งในการตั้งค่าเบราว์เซอร์',
            { 
              duration: 5000,
              icon: '🔒'
            }
          );
          break;

        case err.POSITION_UNAVAILABLE:
          gpsError = {
            code: err.code,
            message: 'ไม่สามารถรับตำแหน่ง GPS ได้',
            type: 'POSITION_UNAVAILABLE'
          };
          toast.error(
            '⚠️ ไม่สามารถรับสัญญาณ GPS ได้\nกรุณาลองใหม่หรือปักหมุดด้วยตนเอง',
            { 
              duration: 5000,
              icon: '📡'
            }
          );
          break;

        case err.TIMEOUT:
          gpsError = {
            code: err.code,
            message: 'หมดเวลารอสัญญาณ GPS',
            type: 'TIMEOUT'
          };
          toast.error(
            '⏱️ หมดเวลารอสัญญาณ GPS\nกรุณาลองใหม่หรือปักหมุดด้วยตนเอง',
            { 
              duration: 5000,
              icon: '⏰'
            }
          );
          break;

        default:
          gpsError = {
            code: err.code,
            message: err.message || 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ',
            type: 'POSITION_UNAVAILABLE'
          };
          toast.error('❌ เกิดข้อผิดพลาดในการรับตำแหน่ง GPS');
      }

      setError(gpsError);
      setLoading(false);
      onError?.(gpsError);
    };

    navigator.geolocation.getCurrentPosition(
      successHandler,
      errorHandler,
      {
        enableHighAccuracy,
        timeout,
        maximumAge
      }
    );
  }, [enableHighAccuracy, timeout, maximumAge, onSuccess, onError]);

  /**
   * Watch position (continuous tracking)
   * Returns watchId that can be used to clear the watch
   */
  const watchPosition = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('เบราว์เซอร์ไม่รองรับ GPS');
      return null;
    }

    setError(null);

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: GPSCoordinates = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          altitude: pos.coords.altitude || undefined,
          timestamp: pos.timestamp
        };
        setPosition(coords);
        onSuccess?.(coords);
      },
      (err) => {
        console.error('GPS watch error:', err);
        // Don't show toast for watch errors (too noisy)
        const gpsError: GPSError = {
          code: err.code,
          message: err.message,
          type: err.code === 1 ? 'PERMISSION_DENIED' : 
                err.code === 2 ? 'POSITION_UNAVAILABLE' : 'TIMEOUT'
        };
        setError(gpsError);
        onError?.(gpsError);
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge
      }
    );

    return watchId;
  }, [enableHighAccuracy, timeout, maximumAge, onSuccess, onError]);

  /**
   * Clear watch position
   */
  const clearWatch = useCallback((watchId: number) => {
    if (navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  /**
   * Retry getting position
   */
  const retry = useCallback(() => {
    setError(null);
    getCurrentPosition();
  }, [getCurrentPosition]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && isSupported) {
      getCurrentPosition();
    }
  }, [autoStart, isSupported, getCurrentPosition]);

  return {
    position,
    error,
    loading,
    isSupported,
    getCurrentPosition,
    watchPosition,
    clearWatch,
    retry
  };
}
