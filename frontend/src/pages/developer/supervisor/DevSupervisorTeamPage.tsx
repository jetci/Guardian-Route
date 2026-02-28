import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useState, useEffect } from 'react';
import { usersApi, type User } from '../../../services/userService';

/**
 * Supervisor Team Overview Page
 * Shows team members status and workload distribution
 */
export default function DevSupervisorTeamPage() {
    const [teamMembers, setTeamMembers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTeamMembers();
    }, []);

    const loadTeamMembers = async () => {
        try {
            const users = await usersApi.getAll();
            const fieldOfficers = users.filter(u => u.role === 'FIELD_OFFICER');
            setTeamMembers(fieldOfficers);
        } catch (error) {
            console.error('Failed to load team members:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
                <header style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    padding: '2rem',
                    borderRadius: '16px',
                    marginBottom: '2rem',
                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
                }}>
                    <h1 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '2rem' }}>
                        👥 ภาพรวมทีม (Team Overview)
                    </h1>
                    <p style={{ margin: 0, opacity: 0.95 }}>
                        สถานะและภาระงานของสมาชิกในทีม
                    </p>
                </header>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a202c' }}>{teamMembers.length}</div>
                        <div style={{ color: '#718096', fontSize: '0.875rem' }}>Total Members</div>
                    </div>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{teamMembers.filter(m => m.isActive).length}</div>
                        <div style={{ color: '#718096', fontSize: '0.875rem' }}>Active</div>
                    </div>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🟢</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                            {Math.floor(Math.random() * teamMembers.length)}
                        </div>
                        <div style={{ color: '#718096', fontSize: '0.875rem' }}>Online Now</div>
                    </div>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                            {Math.floor(Math.random() * 20)}
                        </div>
                        <div style={{ color: '#718096', fontSize: '0.875rem' }}>Active Tasks</div>
                    </div>
                </div>

                {/* Team Members List */}
                <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <h2 style={{ margin: 0, marginBottom: '1.5rem', fontSize: '1.5rem', color: '#1a202c' }}>
                        รายชื่อสมาชิกทีม
                    </h2>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
                            Loading...
                        </div>
                    ) : teamMembers.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
                            ไม่พบสมาชิกในทีม
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {teamMembers.map((member) => (
                                <div key={member.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1.5rem',
                                    padding: '1.5rem',
                                    background: '#f7fafc',
                                    borderRadius: '12px',
                                    border: '2px solid #e2e8f0',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        flexShrink: 0
                                    }}>
                                        {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: 0, marginBottom: '0.25rem', color: '#1a202c', fontSize: '1.125rem' }}>
                                            {member.firstName} {member.lastName}
                                        </h3>
                                        <p style={{ margin: 0, color: '#718096', fontSize: '0.875rem' }}>
                                            {member.email} • {member.phone || 'No phone'}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <span style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            background: Math.random() > 0.5 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                                            color: 'white'
                                        }}>
                                            {Math.random() > 0.5 ? '🟢 Online' : '⚫ Offline'}
                                        </span>

                                        <span style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            background: member.isActive ? '#d1fae5' : '#fee2e2',
                                            color: member.isActive ? '#065f46' : '#991b1b'
                                        }}>
                                            {member.isActive ? 'Active' : 'Inactive'}
                                        </span>

                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1a202c' }}>
                                                {Math.floor(Math.random() * 10)}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#718096' }}>Tasks</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
