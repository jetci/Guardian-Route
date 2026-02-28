import React from 'react';
import { motion } from 'framer-motion';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as any;

interface DashboardCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode | string;
    color?: 'blue' | 'indigo' | 'purple' | 'amber' | 'orange' | 'emerald' | 'teal' | 'red' | 'gray';
    subtitle?: string;
    loading?: boolean;
    onClick?: () => void;
    trend?: 'up' | 'down' | 'stable';
    trendValue?: string;
    variant?: 'default' | 'glass' | 'modern';
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
    title,
    value,
    icon,
    color = 'blue',
    subtitle,
    loading = false,
    onClick,
    trend,
    trendValue,
    variant = 'glass',
}) => {
    const colorSchemes = {
        blue: {
            bg: 'bg-blue-50',
            border: 'border-blue-100',
            iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
            text: 'text-blue-900',
            accent: 'blue-500',
        },
        indigo: {
            bg: 'bg-indigo-50',
            border: 'border-indigo-100',
            iconBg: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
            text: 'text-indigo-900',
            accent: 'indigo-500',
        },
        purple: {
            bg: 'bg-purple-50',
            border: 'border-purple-100',
            iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
            text: 'text-purple-900',
            accent: 'purple-500',
        },
        amber: {
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
            text: 'text-amber-900',
            accent: 'amber-500',
        },
        orange: {
            bg: 'bg-orange-50',
            border: 'border-orange-100',
            iconBg: 'bg-gradient-to-br from-orange-500 to-red-500',
            text: 'text-orange-900',
            accent: 'orange-500',
        },
        emerald: {
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
            iconBg: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
            text: 'text-emerald-900',
            accent: 'emerald-500',
        },
        teal: {
            bg: 'bg-teal-50',
            border: 'border-teal-100',
            iconBg: 'bg-gradient-to-br from-teal-400 to-teal-600',
            text: 'text-teal-900',
            accent: 'teal-500',
        },
        red: {
            bg: 'bg-red-50',
            border: 'border-red-100',
            iconBg: 'bg-gradient-to-br from-red-500 to-red-600',
            text: 'text-red-900',
            accent: 'red-500',
        },
        gray: {
            bg: 'bg-gray-50',
            border: 'border-gray-100',
            iconBg: 'bg-gradient-to-br from-gray-500 to-gray-600',
            text: 'text-gray-900',
            accent: 'gray-500',
        },
    };

    const scheme = colorSchemes[color];

    const trendColors = {
        up: 'text-emerald-600 bg-emerald-100',
        down: 'text-red-600 bg-red-100',
        stable: 'text-gray-600 bg-gray-100',
    };

    const trendIcons = {
        up: '↑',
        down: '↓',
        stable: '→',
    };

    if (variant === 'modern') {
        const borderColors = {
            blue: 'border-l-blue-500',
            indigo: 'border-l-indigo-500',
            purple: 'border-l-purple-500',
            amber: 'border-l-amber-500',
            orange: 'border-l-orange-500',
            emerald: 'border-l-emerald-500',
            teal: 'border-l-teal-500',
            red: 'border-l-red-500',
            gray: 'border-l-gray-500',
        };

        return (
            <div onClick={onClick} className={onClick ? 'cursor-pointer' : ''}>
                <MotionDiv
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className={`
                        bg-white rounded-xl p-6 shadow-sm border-l-4 ${borderColors[color] || 'border-l-blue-500'}
                        flex items-center gap-5 transition-all duration-300 hover:shadow-md
                        group
                    `}
                >
                    <div className="flex-shrink-0 text-3xl opacity-80 group-hover:opacity-100 transition-opacity">
                        {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-black text-gray-900 truncate">
                                {loading ? (
                                    <div className="h-9 w-24 bg-gray-100 animate-pulse rounded-lg" />
                                ) : (
                                    value
                                )}
                            </h3>
                            {trend && trendValue && !loading && (
                                <div className={`text-xs font-bold ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-gray-500'}`}>
                                    {trendIcons[trend]} {trendValue}
                                </div>
                            )}
                        </div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                            {title}
                        </p>
                    </div>
                </MotionDiv>
            </div>
        );
    }

    if (variant === 'glass') {
        return (
            <div onClick={onClick} className={onClick ? 'cursor-pointer' : ''}>
                <MotionDiv
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className={`
                        relative overflow-hidden rounded-[2.5rem] p-7 border border-white/20 shadow-2xl backdrop-blur-3xl transition-all duration-300
                        bg-[#0a1224]/80 hover:bg-[#0a1224]/90 min-h-[160px] flex flex-col justify-between
                        ${onClick ? 'hover:shadow-blue-500/10' : ''}
                        group
                    `}
                >
                    {/* Glass Decoration */}
                    <div className={`absolute -right-4 -top-4 w-32 h-32 bg-${scheme.accent} opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity`} />
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <div className="flex items-start justify-between relative z-10">
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">
                                {title}
                            </p>

                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-black text-white truncate tracking-tight py-1">
                                    {loading ? (
                                        <div className="h-10 w-24 bg-slate-800 animate-pulse rounded-lg" />
                                    ) : (
                                        value
                                    )}
                                </h3>

                                {trend && trendValue && !loading && (
                                    <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : trend === 'down' ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 bg-slate-500/10'}`}>
                                        <span>{trendIcons[trend]}</span>
                                        <span>{trendValue}</span>
                                    </div>
                                )}
                            </div>

                            {subtitle && !loading && (
                                <p className="text-xs text-slate-500 mt-2 font-medium truncate" title={subtitle}>
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        <div className={`
                            flex-shrink-0 w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl border border-white/10
                            ${scheme.iconBg} text-white
                            group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500
                        `}>
                            {typeof icon === 'string' ? (
                                <span className="text-2xl">{icon}</span>
                            ) : (
                                React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 32 })
                            )}
                        </div>
                    </div>
                </MotionDiv>
            </div>
        );
    }

    return (
        <div onClick={onClick} className={onClick ? 'cursor-pointer' : ''}>
            <MotionDiv
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`
          relative overflow-hidden rounded-2xl p-6 border shadow-sm transition-all duration-300
          ${scheme.bg} ${scheme.border}
          ${onClick ? 'hover:shadow-lg' : ''}
          group
        `}
            >
                {/* Background Micro-pattern or Glow */}
                <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${scheme.accent} opacity-5 blur-2xl rounded-full group-hover:opacity-10 transition-opacity`} />

                <div className="flex items-start justify-between relative z-10">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            {title}
                        </p>

                        <div className="flex items-baseline gap-2">
                            <h3 className={`text-3xl font-extrabold ${scheme.text} truncate`}>
                                {loading ? (
                                    <div className="h-9 w-24 bg-gray-200 animate-pulse rounded-lg" />
                                ) : (
                                    value
                                )}
                            </h3>

                            {trend && trendValue && !loading && (
                                <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : trend === 'down' ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 bg-slate-500/10'}`}>
                                    <span>{trendIcons[trend]}</span>
                                    <span>{trendValue}</span>
                                </div>
                            )}
                        </div>

                        {subtitle && !loading && (
                            <p className="text-xs text-gray-500 mt-1 truncate" title={subtitle}>
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className={`
                  flex-shrink-0 p-4 rounded-xl shadow-lg shadow-${scheme.accent}/20
                  ${scheme.iconBg} text-white
                  group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300
                `}>
                        {typeof icon === 'string' ? (
                            <span className="text-2xl">{icon}</span>
                        ) : (
                            icon
                        )}
                    </div>
                </div>
            </MotionDiv>
        </div>
    );
};
