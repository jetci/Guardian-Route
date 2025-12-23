/**
 * ErrorMessage Component
 * Reusable error display component
 */

import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import './ErrorMessage.css';

export interface ErrorMessageProps {
    /** Error title */
    title?: string;
    /** Error message to display */
    message: string;
    /** Optional retry function */
    onRetry?: () => void;
    /** Optional dismiss function */
    onDismiss?: () => void;
    /** Custom className */
    className?: string;
    /** Center in container */
    centered?: boolean;
}

/**
 * ErrorMessage - Displays error with optional retry and dismiss actions
 * 
 * @example
 * ```tsx
 * <ErrorMessage 
 *   title="เกิดข้อผิดพลาด"
 *   message="ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง"
 *   onRetry={() => loadData()}
 *   centered
 * />
 * ```
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    title = 'เกิดข้อผิดพลาด',
    message,
    onRetry,
    onDismiss,
    className = '',
    centered = false,
}) => {
    const containerClass = centered ? 'error-container-centered' : 'error-container';

    return (
        <div className={`${containerClass} ${className}`}>
            <div className="error-card">
                {/* Dismiss button */}
                {onDismiss && (
                    <button
                        className="error-dismiss"
                        onClick={onDismiss}
                        aria-label="ปิด"
                    >
                        <X size={20} />
                    </button>
                )}

                {/* Error icon */}
                <div className="error-icon">
                    <AlertCircle size={48} />
                </div>

                {/* Error content */}
                <div className="error-content">
                    <h3 className="error-title">{title}</h3>
                    <p className="error-message">{message}</p>
                </div>

                {/* Retry button */}
                {onRetry && (
                    <button
                        className="error-retry-button"
                        onClick={onRetry}
                    >
                        <RefreshCw size={18} />
                        <span>ลองใหม่อีกครั้ง</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorMessage;
