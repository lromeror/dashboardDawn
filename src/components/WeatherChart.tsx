import React, { useState, useEffect } from 'react';
import { fetchCoordinates, fetchHistoricalWeatherData } from '../api/api';
import { Typography, Paper } from '@mui/material';
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface WeatherChartProps {
    city: string;
    historicalType: string;
}

const WeatherChart: React.FC<WeatherChartProps> = ({ city, historicalType }) => {
    const [chartData, setChartData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { lat, lon } = await fetchCoordinates(city);
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(endDate.getDate() - 6);

                const formattedEndDate = endDate.toISOString().split('T')[0];
                const formattedStartDate = startDate.toISOString().split('T')[0];

                const historicalData = await fetchHistoricalWeatherData(lat, lon, formattedStartDate, formattedEndDate, historicalType);

                if (!historicalData.daily) {
                    throw new Error('No hay datos disponibles');
                }

                const dataKey = {
                    temperature: 'temperature_2m_max',
                    humidity: 'relative_humidity_2m_max',
                    precipitation: 'precipitation_sum',
                }[historicalType];

                if (dataKey && historicalData.daily[dataKey]) {
                    const formattedData = historicalData.daily[dataKey].map((value: number, i: number) => {
                        const date = new Date();
                        date.setDate(date.getDate() - i);
                        return { date: date.toLocaleDateString(), value };
                    }).reverse();

                    setChartData(formattedData);
                    setError(null);
                } else {
                    throw new Error(`No data available for ${dataKey}`);
                }
            } catch (error) {
                setError(`Error: ${(error as Error).message}`);
                console.error(error);
            }
        };
        fetchData();
    }, [city, historicalType]);

    return (
        <Paper elevation={3} sx={{ borderRadius: 2, padding: 2 }}>
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 'bold',
                    mb: 2,
                    textAlign: 'center',
                }}
            >
                Última semana - {historicalType.charAt(0).toUpperCase() + historicalType.slice(1)}
            </Typography>
            {error ? (
                <Typography variant="body1" color="error">
                    {error}
                </Typography>
            ) : (
                <ResponsiveContainer height={450}>
                    <ComposedChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" barSize={40} fill="#78a" name="Valores" />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#ff7300"
                            strokeWidth={3}
                            dot={{ fill: '#ff7300', r: 5 }}
                            name="Tendencia"
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            )}
        </Paper>
    );
};

export default WeatherChart;
