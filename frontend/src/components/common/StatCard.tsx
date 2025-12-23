import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendDirection?: 'positive' | 'negative' | 'neutral';
    color?: 'purple' | 'blue' | 'orange' | 'green' | 'red';
    loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    trend,
    trendDirection = 'neutral',
    color = 'blue',
    loading = false
}) => {
    const getColorClass = () => {
        switch (color) {
            case 'purple': return 'bg-purple-50 text-purple-600';
            case 'blue': return 'bg-blue-50 text-blue-600';
            case 'orange': return 'bg-orange-50 text-orange-600';
            case 'green': return 'bg-green-50 text-green-600';
            case 'red': return 'bg-red-50 text-red-600';
            default: return 'bg-gray-50 text-gray-600';
        }
    };

    const getTrendColor = () => {
        switch (trendDirection) {
            case 'positive': return 'text-green-600';
            case 'negative': return 'text-red-600';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900">
                        {loading ? (
                            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                        ) : (
                            value
                        )}
                    </h3>
                </div>
                <div className={`p-3 rounded-lg ${getColorClass()}`}>
                    <span className="text-xl">{icon}</span>
                </div>
            </div>
            {trend && (
                <div className={`mt-4 text-sm font-medium ${getTrendColor()}`}>
                    {trend}
                </div>
            )}
        </div>
    );
};
