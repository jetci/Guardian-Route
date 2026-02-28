import { useEffect, useState } from 'react';
import { weatherService, getWeatherDescription } from '../../services/weatherService';
import type { WeatherData } from '../../services/weatherService';
import { CloudRain, Wind, Droplets } from 'lucide-react';

export const WeatherWidget = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadWeather = async () => {
            try {
                const data = await weatherService.getWeather();
                setWeather(data);
            } catch (error) {
                console.error('Failed to load weather:', error);
            } finally {
                setLoading(false);
            }
        };
        loadWeather();
    }, []);

    if (loading) {
        return (
            <div style={{ background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', width: '100%' }}>
                <div className="animate-spin" style={{ width: '24px', height: '24px', border: '2px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%' }}></div>
            </div>
        );
    }

    if (!weather) {
        return (
            <div style={{ background: 'white', padding: '16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                ไม่สามารถโหลดข้อมูล
            </div>
        );
    }

    const currentCondition = getWeatherDescription(weather.current.weatherCode);

    return (
        <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Sarabun', sans-serif",
            height: '100%',
            minHeight: '150px', // Reduced height for mobile
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
            {/* Background Decor */}
            <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }} />

            <div style={{ position: 'relative', zIndex: 10, padding: '16px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                        <h3 style={{ fontSize: '14px', fontWeight: '700', margin: 0, textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>สภาพอากาศวันนี้</h3>
                        <p style={{ fontSize: '11px', margin: '2px 0 0', opacity: 0.9 }}>ต.เวียง อ.ฝาง จ.เชียงใหม่</p>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                    {/* Left: Temp & Icon */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ fontSize: '42px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>
                            {currentCondition.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '36px', fontWeight: '800', lineHeight: 1, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                {Math.round(weather.current.temperature)}°
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: '500', opacity: 0.95 }}>
                                {currentCondition.label}
                            </div>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '6px' }}>
                            <Droplets size={12} color="#60a5fa" fill="#60a5fa" />
                            <span>{weather.current.humidity}%</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '6px' }}>
                            <Wind size={12} color="#a5b4fc" />
                            <span>{weather.current.windSpeed} km/h</span>
                        </div>
                    </div>
                </div>

                {/* Forecast - Tiny Version */}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '8px' }}>
                    {weather.daily.time.slice(1, 4).map((date, index) => {
                        const code = weather.daily.weatherCode[index + 1];
                        const maxTemp = weather.daily.maxTemp[index + 1];
                        const minTemp = weather.daily.minTemp[index + 1];
                        const condition = getWeatherDescription(code);
                        const dayName = new Date(date).toLocaleDateString('th-TH', { weekday: 'short' });

                        return (
                            <div key={date} style={{ textAlign: 'center', flex: 1 }}>
                                <div style={{ fontSize: '10px', fontWeight: '600', opacity: 0.9 }}>{dayName}</div>
                                <div style={{ fontSize: '16px', margin: '2px 0' }}>{condition.icon}</div>
                                <div style={{ fontSize: '10px' }}>
                                    <span style={{ fontWeight: '700' }}>{Math.round(maxTemp)}°</span>
                                    <span style={{ opacity: 0.7 }}>/</span>
                                    <span style={{ opacity: 0.9 }}>{Math.round(minTemp)}°</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};
