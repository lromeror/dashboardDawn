export const getStoredWeatherData = (city: string) => {
    const localStorageKey = `weatherData_${city}`;
    const cachedData = localStorage.getItem(localStorageKey);

    if (cachedData) {
        const parser = new DOMParser();
        return parser.parseFromString(cachedData, "application/xml");
    }
    return null;
};
