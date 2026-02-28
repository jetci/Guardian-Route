/**
 * EmptyState Component
 * Displays when there is no data to show
 */

import React, { type ReactNode } from 'react';
import { Inbox, FileSearch, MapPin, ClipboardList } from 'lucide-react';
import './EmptyState.css';

export type EmptyStateIcon = 'inbox' | 'search' | 'map' | 'clipboard' | 'custom';

export interface EmptyStateProps {
    /** Icon type to display */
    icon?: EmptyStateIcon;
    /** Custom icon component */
    customIcon?: ReactNode;
    /** Main title */
    title: string;
    /** Description message */
    description?: string;
    /** Optional action button */
    action?: {
        label: string;
        onClick: () => void;
    };
    /** Custom className */
    className?: string;
}

const iconMap = {
    inbox: Inbox,
    search: FileSearch,
    map: MapPin,
    clipboard: ClipboardList,
};

/**
 * EmptyState - Shows when there is no data available
 * 
 * @example
 * ```tsx
 * <EmptyState 
 *   icon="inbox"
 *   title="ไม่มีรายงาน"
 *   description="คุณยังไม่มีรายงานใดๆ เริ่มสร้างรายงานแรกของคุณเลย"
 *   action={{
 *     label: "สร้างรายงาน",
 *     onClick: () => navigate('/create-report')
 *   }}
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
    icon = 'inbox',
    customIcon,
    title,
    description,
    action,
    className = '',
}) => {
    const IconComponent = icon !== 'custom' ? iconMap[icon] : null;

    return (
        <div className={`empty-state ${className}`}>
            <div className="empty-state-icon">
                {customIcon ? customIcon : IconComponent && <IconComponent size={64} />}
            </div>

            <div className="empty-state-content">
                <h3 className="empty-state-title">{title}</h3>
                {description && (
                    <p className="empty-state-description">{description}</p>
                )}
            </div>

            {action && (
                <button
                    className="empty-state-action"
                    onClick={action.onClick}
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
