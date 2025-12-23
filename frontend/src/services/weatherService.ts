import axios from 'axios';

export interface WeatherData {
    current: {
        temperature: number;
        humidity: number;
        windSpeed: number;
        weatherCode: number;
        isDay: number;
    };
    daily: {
        time: string[];
        weatherCode: number[];
        maxTemp: number[];
        minTemp: number[];
        rainSum: number[];
        precipProb: number[];
    };
}

// WMO Weather interpretation codes (WW)
export const getWeatherDescription = (code: number): { label: string; icon: string } => {
    const codes: Record<number, { label: string; icon: string }> = {
        0: { label: 'ท้องฟ้าแจ่มใส', icon: '☀️' },
        1: { label: 'มีเมฆบางส่วน', icon: '🌤️' },
        2: { label: 'มีเมฆเป็นส่วนมาก', icon: '⛅' },
        3: { label: 'มีเมฆมาก', icon: '☁️' },
        45: { label: 'มีหมอก', icon: '🌫️' },
        48: { label: 'มีหมอกจัด', icon: '🌫️' },
        51: { label: 'ฝนปรอยๆ เบาบาง', icon: '🌦️' },
        53: { label: 'ฝนปรอยๆ ปานกลาง', icon: '🌦️' },
        55: { label: 'ฝนปรอยๆ หนัก', icon: '🌧️' },
        61: { label: 'ฝนตกเล็กน้อย', icon: '🌦️' },
        63: { label: 'ฝนตกปานกลาง', icon: '🌧️' },
        65: { label: 'ฝนตกหนัก', icon: '⛈️' },
        80: { label: 'ฝนตกหนักมาก', icon: '⛈️' },
        81: { label: 'ฝนตกหนักมาก', icon: '⛈️' },
        82: { label: 'ฝนตกหนักและรุนแรง', icon: '⛈️' },
        95: { label: 'พายุฝนฟ้าคะนอง', icon: '⚡' },
        96: { label: 'พายุฝนและลูกเห็บ', icon: '⛈️' },
        99: { label: 'พายุฝนรุนแรงและลูกเห็บ', icon: '⛈️' },
    };
    return codes[code] || { label: 'ไม่ทราบสถานะ', icon: '❓' };
};

export const weatherService = {
    getWeather: async (lat: number = 19.9167, lng: number = 99.2333): Promise<WeatherData> => {
        try {
            const response = await axios.get(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`
            );

            const data = response.data;

            return {
                current: {
                    temperature: data.current.temperature_2m,
                    humidity: data.current.relative_humidity_2m,
                    windSpeed: data.current.wind_speed_10m,
                    weatherCode: data.current.weather_code,
                    isDay: data.current.is_day,
                },
                daily: {
                    time: data.daily.time,
                    weatherCode: data.daily.weather_code,
                    maxTemp: data.daily.temperature_2m_max,
                    minTemp: data.daily.temperature_2m_min,
                    rainSum: data.daily.precipitation_sum,
                    precipProb: data.daily.precipitation_probability_max,
                },
            };
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw error;
        }
    },
};
