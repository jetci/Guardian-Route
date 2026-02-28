/**
 * Breadcrumbs Component
 * Navigation breadcrumbs for Field Officer pages
 */

import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

interface BreadcrumbItem {
    label: string;
    path: string;
}

const routeMap: Record<string, BreadcrumbItem[]> = {
    '/field-officer/dashboard': [
        { label: 'หน้าหลัก', path: '/' },
        { label: 'Dashboard', path: '/field-officer/dashboard' }
    ],
    '/survey-area': [
        { label: 'หน้าหลัก', path: '/' },
        { label: 'Dashboard', path: '/field-officer/dashboard' },
        { label: 'สำรวจพื้นที่', path: '/survey-area' }
    ],
    '/survey-history': [
        { label: 'หน้าหลัก', path: '/' },
        { label: 'Dashboard', path: '/field-officer/dashboard' },
        { label: 'ประวัติการสำรวจ', path: '/survey-history' }
    ],
    '/survey-review': [
        { label: 'หน้าหลัก', path: '/' },
        { label: 'Dashboard', path: '/field-officer/dashboard' },
        { label: 'สำรวจพื้นที่', path: '/survey-area' },
        { label: 'ตรวจสอบข้อมูล', path: '/survey-review' }
    ],
    '/create-incident': [
        { label: 'หน้าหลัก', path: '/' },
        { label: 'Dashboard', path: '/field-officer/dashboard' },
        { label: 'รายงานเหตุการณ์', path: '/create-incident' }
    ],
    '/tasks/my-tasks': [
        { label: 'หน้าหลัก', path: '/' },
        { label: 'Dashboard', path: '/field-officer/dashboard' },
        { label: 'งานของฉัน', path: '/tasks/my-tasks' }
    ]
};

export function Breadcrumbs() {
    const location = useLocation();
    const breadcrumbs = routeMap[location.pathname] || [
        { label: 'หน้าหลัก', path: '/' }
    ];

    return (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol className="breadcrumbs-list">
                {breadcrumbs.map((crumb, index) => (
                    <li key={crumb.path} className="breadcrumb-item">
                        {index < breadcrumbs.length - 1 ? (
                            <>
                                <Link to={crumb.path} className="breadcrumb-link">
                                    {crumb.label}
                                </Link>
                                <span className="breadcrumb-separator">›</span>
                            </>
                        ) : (
                            <span className="breadcrumb-current">{crumb.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
