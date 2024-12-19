import React, { useState, useEffect } from 'react';
import { getWeatherData } from '../api/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';

interface WeatherTableProps {
    cities: string[];
}

const WeatherTable: React.FC<WeatherTableProps> = ({ cities }) => {
    const [weatherData, setWeatherData] = useState<{ [key: string]: Document }>({});

    useEffect(() => {
        const fetchData = async () => {
            const data = await Promise.all(cities.map(async (city) => {
                const result = await getWeatherData(city);
                return { city, data: result };
            }));

            const weatherDataObject: { [key: string]: Document } = {};
            data.forEach(({ city, data }) => {
                weatherDataObject[city] = data;
            });

            setWeatherData(weatherDataObject);
        };

        fetchData();
    }, [cities]);

    return (
        <Box sx={{ mt: 4, mx: 'auto', maxWidth: 8000 }}>
            <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#78a' }}>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>City</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>Condition</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>Temperature (°C)</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>Humidity (%)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cities.map((city) => {
                            const data = weatherData[city];
                            if (!data) {
                                return (
                                    <TableRow key={city}>
                                        <TableCell colSpan={4} align="center" sx={{ fontStyle: 'italic', color: '#999' }}>
                                            Loading data...
                                        </TableCell>
                                    </TableRow>
                                );
                            }
                            const temperatureKelvin = parseFloat(data.querySelector('temperature')?.getAttribute('value') || '0');
                            const temperatureCelsius = temperatureKelvin - 273.15;
                            const humidity = data.querySelector('humidity')?.getAttribute('value');
                            const condition = data.querySelector('weather')?.getAttribute('value');
                            return (
                                <TableRow key={city} sx={{ '&:hover': { backgroundColor: '#f1f8e9' } }}>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>{city}</TableCell>
                                    <TableCell sx={{ color: '#666' }}>{condition}</TableCell>
                                    <TableCell sx={{ color: '#666' }}>{temperatureCelsius.toFixed(2)}</TableCell>
                                    <TableCell sx={{ color: '#666' }}>{humidity}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default WeatherTable;
