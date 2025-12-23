import { useEffect, useState } from 'react';
import { weatherService, getWeatherDescription } from '../../services/weatherService';
import type { WeatherData } from '../../services/weatherService';

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
            <div className="bg-white rounded-xl shadow-sm p-6 h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!weather) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 h-full flex items-center justify-center text-gray-500">
                ไม่สามารถโหลดข้อมูลสภาพอากาศได้
            </div>
        );
    }

    const currentCondition = getWeatherDescription(weather.current.weatherCode);

    return (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white h-full relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>

            <div className="relative z-10 h-full flex flex-col justify-between">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                        <h3 className="text-lg font-bold">สภาพอากาศวันนี้</h3>
                        <p className="text-sm opacity-90">ต.เวียง อ.ฝาง จ.เชียงใหม่</p>
                    </div>
                    <div className="text-left md:text-right">
                        <div className="text-sm opacity-90">{new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                    </div>
                </div>

                {/* Main Weather Info */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 my-4">
                    <div className="flex items-center gap-4">
                        <div className="text-6xl">{currentCondition.icon}</div>
                        <div>
                            <div className="text-5xl font-bold tracking-tight">
                                {Math.round(weather.current.temperature)}°
                            </div>
                            <p className="text-lg font-medium opacity-90">{currentCondition.label}</p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-row md:flex-col gap-4 md:gap-2 text-sm bg-white/10 p-3 rounded-lg backdrop-blur-sm w-full md:w-auto justify-center md:justify-start">
                        <div className="flex items-center gap-2">
                            <span>💧</span>
                            <span className="opacity-90">ความชื้น: {weather.current.humidity}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>💨</span>
                            <span className="opacity-90">ลม: {weather.current.windSpeed} km/h</span>
                        </div>
                    </div>
                </div>

                {/* 3-Day Forecast */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/20">
                    {weather.daily.time.slice(1, 4).map((date, index) => {
                        const code = weather.daily.weatherCode[index + 1];
                        const maxTemp = weather.daily.maxTemp[index + 1];
                        const minTemp = weather.daily.minTemp[index + 1];
                        const condition = getWeatherDescription(code);
                        const dayName = new Date(date).toLocaleDateString('th-TH', { weekday: 'short' });

                        return (
                            <div key={date} className="flex flex-col items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <span className="text-sm font-medium opacity-90">{dayName}</span>
                                <span className="text-2xl my-1">{condition.icon}</span>
                                <div className="text-sm">
                                    <span className="font-bold">{Math.round(maxTemp)}°</span>
                                    <span className="mx-1 opacity-60">/</span>
                                    <span className="opacity-80">{Math.round(minTemp)}°</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
