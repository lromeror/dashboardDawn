const API_KEY = '45f9bc3282db66f8b0525afe1ea11bd9';

export const fetchWeatherData = async (city: string) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&mode=xml`);
    const xmlText = await response.text();
    const parser = new DOMParser();
    return parser.parseFromString(xmlText, "application/xml");
};

export const getWeatherData = async (city: string) => {
    const now = new Date().getTime();
    const localStorageKey = `weatherData_${city}`;
    const cachedData = localStorage.getItem(localStorageKey);
    const cachedTime = localStorage.getItem(`${localStorageKey}_time`);

    if (cachedData && cachedTime && now - parseInt(cachedTime) < 3600000) { 
        const parser = new DOMParser();
        return parser.parseFromString(cachedData, "application/xml");
    } else {
        const data = await fetchWeatherData(city);
        const serializer = new XMLSerializer();
        localStorage.setItem(localStorageKey, serializer.serializeToString(data));
        localStorage.setItem(`${localStorageKey}_time`, now.toString());
        return data;
    }
};
export const fetchCoordinates = async (city: string): Promise<{ lat: number; lon: number; country: string }> => {
    try {
        const encodedCity = encodeURIComponent(city);
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${API_KEY}`;
        console.log('Fetching coordinates from URL:', url);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching coordinates for city ${city}: ${response.statusText}`);
        }
        const data = await response.json();
        const {
            coord: { lat, lon },
            sys: { country },
        } = data;
        return { lat, lon, country };
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw error;
    }
};
export const fetchHistoricalWeatherData = async (
    lat: number,
    lon: number,
    start: string,
    end: string,
    type: string
): Promise<any> => {
    let dailyParam;
    switch (type) {
        case 'temperature':
            dailyParam = 'temperature_2m_max';
            break;
        case 'humidity':
            dailyParam = 'relative_humidity_2m_max';
            break;
        case 'precipitation':
            dailyParam = 'precipitation_sum';
            break;
        default:
            dailyParam = 'temperature_2m_max';
    }

    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&daily=${dailyParam}&timezone=UTC`
    );

    if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Error fetching historical weather data: ${response.status} ${response.statusText} - ${errorDetails}`);
    }

    const data = await response.json();
    return data;
};
