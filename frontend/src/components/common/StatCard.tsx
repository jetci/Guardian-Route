import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendDirection?: 'positive' | 'negative' | 'neutral';
    color?: 'purple' | 'blue' | 'orange' | 'green' | 'red' | 'indigo' | 'violet';
    loading?: boolean;
    className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    trend,
    trendDirection = 'neutral',
    color = 'blue',
    loading = false,
    className = ''
}) => {
    const getGradientClass = () => {
        switch (color) {
            case 'purple': return 'from-purple-500 to-purple-600 shadow-purple-200';
            case 'blue': return 'from-blue-500 to-blue-600 shadow-blue-200';
            case 'orange': return 'from-orange-500 to-orange-600 shadow-orange-200';
            case 'green': return 'from-emerald-500 to-emerald-600 shadow-emerald-200';
            case 'red': return 'from-red-500 to-red-600 shadow-red-200';
            case 'indigo': return 'from-indigo-500 to-indigo-600 shadow-indigo-200';
            case 'violet': return 'from-violet-500 to-violet-600 shadow-violet-200';
            default: return 'from-slate-500 to-slate-600 shadow-slate-200';
        }
    };

    const getIconBgClass = () => {
        return 'bg-white/20 backdrop-blur-sm';
    };

    return (
        <div
            className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-xl bg-gradient-to-br ${getGradientClass()} ${className} transition-all duration-300 hover:shadow-2xl`}
        >
            <div className="flex flex-col justify-between min-h-[160px]">
                <div className="flex justify-between items-start mb-4">
                    <div className={`${getIconBgClass()} w-12 h-12 rounded-xl flex items-center justify-center shadow-inner`}>
                        <span className="text-2xl">{icon}</span>
                    </div>
                    {trend && (
                        <div className={`px-2 py-1 rounded-lg text-xs font-bold bg-white/20 backdrop-blur-md border border-white/10 ${trendDirection === 'positive' ? 'text-green-100' :
                                trendDirection === 'negative' ? 'text-red-100' : 'text-white'
                            }`}>
                            {trend}
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-4xl font-bold mb-1 tracking-tight">
                        {loading ? (
                            <div className="h-10 w-24 bg-white/20 animate-pulse rounded"></div>
                        ) : (
                            value
                        )}
                    </h3>
                    <p className="text-white/90 font-medium text-sm uppercase tracking-wider opacity-90">
                        {title}
                    </p>
                </div>
            </div>
        </div>
    );
};
