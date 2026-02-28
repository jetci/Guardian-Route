import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import './BottomNav.css';

export function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthStore();

    const getMenuItems = () => {
        const userRole = user?.role ? String(user.role) : '';

        // Mobile-optimized menu items (fewer items, icons focused)
        switch (userRole) {
            case 'FIELD_OFFICER':
                return [
                    { icon: '👨‍🚒', label: 'หน้าหลัก', path: '/field-officer/dashboard' },
                    { icon: '📋', label: 'งาน', path: '/dashboard/officer' },
                    { icon: '🔍', label: 'สำรวจ', path: '/survey-area' },
                    { icon: '📝', label: 'แจ้งเหตุ', path: '/create-incident' },
                    { icon: '👤', label: 'โปรไฟล์', path: '/profile' },
                ];
            case 'SUPERVISOR':
                return [
                    { icon: '🖥️', label: 'แดชบอร์ด', path: '/dashboard/supervisor' },
                    { icon: '⚠️', label: 'เหตุการณ์', path: '/manage-incidents' },
                    { icon: '👥', label: 'ทีม', path: '/team-overview' },
                    { icon: '👤', label: 'โปรไฟล์', path: '/profile' },
                ];
            default:
                // Fallback for other roles or generic mobile view
                return [
                    { icon: '🏠', label: 'หน้าหลัก', path: '/' },
                    { icon: '👤', label: 'โปรไฟล์', path: '/profile' },
                ];
        }
    };

    const menuItems = getMenuItems();

    return (
        <div className="bottom-nav">
            {menuItems.map((item) => (
                <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                    <span className="bottom-nav-icon">{item.icon}</span>
                    <span className="bottom-nav-label">{item.label}</span>
                </button>
            ))}
        </div>
    );
}
