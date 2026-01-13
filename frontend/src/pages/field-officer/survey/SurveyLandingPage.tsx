import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { tasksApi } from '../../../api/tasks';
import toast from 'react-hot-toast';

export default function SurveyLandingPage() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const myTasks = await tasksApi.getMyTasks();
                // Filter for tasks that are PENDING or IN_PROGRESS
                const activeTasks = myTasks.filter((t: any) =>
                    t.status === 'PENDING' || t.status === 'IN_PROGRESS' || t.status === 'REVISION_REQUIRED'
                );
                setTasks(activeTasks);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
                toast.error('ไม่สามารถโหลดข้อมูลงานได้ (ใช้ข้อมูลจำลอง)');
                // Mock Data for offline testing
                setTasks([
                    {
                        id: 'mock-task-1',
                        title: 'สำรวจน้ำท่วม หมู่ 1',
                        description: 'ตรวจสอบความเสียหายจากน้ำท่วมฉับพลัน',
                        status: 'PENDING',
                        createdAt: new Date().toISOString(),
                        village: { name: 'บ้านท่าช้าง' },
                        incident: { disasterType: 'FLOOD' }
                    },
                    {
                        id: 'mock-task-2',
                        title: 'สำรวจดินถล่ม',
                        description: 'พื้นที่เสี่ยงภัยดินถล่มหลังฝนตกหนัก',
                        status: 'IN_PROGRESS',
                        createdAt: new Date().toISOString(),
                        village: { name: 'บ้านดอยปุย' },
                        incident: { disasterType: 'LANDSLIDE' }
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const handleSelectTask = (taskId: string) => {
        navigate(`/survey-area/${taskId}`);
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto p-4">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">เลือกงานสำรวจ</h1>
                    <p className="text-gray-600">กรุณาเลือกงานที่ได้รับมอบหมายเพื่อเริ่มการสำรวจ</p>
                </header>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-lg font-medium text-gray-900">ไม่มีงานที่ต้องสำรวจ</h3>
                        <p className="text-gray-500">คุณไม่มีงานที่ได้รับมอบหมายในขณะนี้</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {tasks.map((task) => (
                            <button
                                key={task.id}
                                onClick={() => handleSelectTask(task.id)}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all text-left group relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 group-hover:bg-blue-600 transition-colors" />

                                <div className="flex justify-between items-start mb-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${task.status === 'REVISION_REQUIRED' ? 'bg-yellow-100 text-yellow-700' :
                                        task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {task.status === 'REVISION_REQUIRED' ? 'แก้ไขงาน' :
                                            task.status === 'IN_PROGRESS' ? 'กำลังดำเนินการ' : 'รอดำเนินการ'}
                                    </span>
                                    <span className="text-xs text-gray-400">{new Date(task.createdAt).toLocaleDateString('th-TH')}</span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                                    {task.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                    {task.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                                </p>

                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>📍 {task.village?.name || 'ไม่ระบุหมู่บ้าน'}</span>
                                    <span>•</span>
                                    <span>🚨 {task.incident?.disasterType || 'ไม่ระบุภัย'}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
