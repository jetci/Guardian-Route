/**
 * LoadingSpinner Component
 * Reusable loading spinner for the entire application
 */

import React from 'react';
import './LoadingSpinner.css';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface LoadingSpinnerProps {
    /** Size of the spinner */
    size?: SpinnerSize;
    /** Optional message to display below spinner */
    message?: string;
    /** Center spinner in container */
    centered?: boolean;
    /** Custom className */
    className?: string;
}

/**
 * LoadingSpinner - Displays an animated loading indicator
 * 
 * @example
 * ```tsx
 * <LoadingSpinner size="md" message="กำลังโหลดข้อมูล..." centered />
 * ```
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    message,
    centered = false,
    className = '',
}) => {
    const sizeClass = `spinner-${size}`;
    const containerClass = centered ? 'spinner-container-centered' : 'spinner-container';

    return (
        <div className={`${containerClass} ${className}`}>
            <div className={`spinner ${sizeClass}`}>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
            </div>
            {message && <p className="spinner-message">{message}</p>}
        </div>
    );
};

export default LoadingSpinner;
