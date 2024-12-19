import React, { useState, useEffect } from 'react';
import CitySelector from './components/CitySelector';
import WeatherIndicator from './components/WeatherIndicator';
import WeatherTable from './components/WeatherTable';
import WeatherChart from './components/WeatherChart';
import ForecastIndicator from './components/ForecastIndicator';
import SearchCityInput from './components/SearchCityInput';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, List, ListItemButton, ListItemText, Typography, Grid, Container } from '@mui/material';

import { fetchHistoricalWeatherData, fetchCoordinates } from './api/api';

const ecuadorianCities = [
    'Cuenca', 'Guaranda', 'Azogues', 'Tulcán', 'Riobamba', 'Latacunga',
    'Machala', 'Puerto Baquerizo Moreno', 'Guayaquil',
    'Ibarra', 'Loja', 'Babahoyo', 'Portoviejo', 'Macas', 'Tena', 'Puyo', 'Quito', 'Santa Elena',
    'Nueva Loja', 'Ambato', 'Zamora'
];

const theme = createTheme({
    typography: {
        h1: {
            fontSize: '2rem',
        },
        h2: {
            fontSize: '1.8rem',
            marginTop: 30,
            marginBottom: 30
        },
    },
});

const App: React.FC = () => {
    const [cityInput, setCityInput] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('Guayaquil');
    const [forecastData, setForecastData] = useState<any>(null);
    const [historicalType, setHistoricalType] = useState<string>('temperature');

    useEffect(() => {
        if (selectedCity) {
            handleCityChange(selectedCity);
        }
    }, [selectedCity, historicalType]);

    const handleCityChange = async (city: string) => {
        try {
            const { lat, lon, country } = await fetchCoordinates(city);
            if (country !== 'EC') {
                alert('Ingresa una ciudad de Ecuador.');
                return;
            }

            setSelectedCity(city);

            const now = new Date();
            const startDate = now.toISOString().split('T')[0];
            now.setDate(now.getDate() + 3);
            const endDate = now.toISOString().split('T')[0];
            const forecast = await fetchHistoricalWeatherData(lat, lon, startDate, endDate, historicalType);
            setForecastData(forecast);
        } catch (err) {
            console.error('Error obteniendo los datos:', err);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" sx={{ backgroundColor: '#78a' }}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        sx={{
                            flexGrow: 1,
                            textAlign: 'left',
                        }}
                    >
                        Climate Weather
                    </Typography>
                    <Box>
                        <List sx={{ display: 'flex', flexDirection: 'row', padding: 0 }}>
                            <ListItemButton component="a" href="#city-selector" sx={{ color: '#fff', padding: '0 16px' }}>
                                <ListItemText primary="Búsqueda" />
                            </ListItemButton>
                            <ListItemButton component="a" href="#indicators" sx={{ color: '#fff', padding: '0 16px' }}>
                                <ListItemText primary="Indicadores" />
                            </ListItemButton>
                            <ListItemButton component="a" href="#forecast" sx={{ color: '#f1bc3', padding: '0 16px' }}>
                                <ListItemText primary="Pronósticos" />
                            </ListItemButton>
                            <ListItemButton component="a" href="#historical" sx={{ color: '#fff', padding: '0 16px' }}>
                                <ListItemText primary="Histórico" />
                            </ListItemButton>
                            <ListItemButton component="a" href="#summary" sx={{ color: '#fff', padding: '0 16px' }}>
                                <ListItemText primary="Capitales" />
                            </ListItemButton>
                        </List>
                    </Box>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ py: 4, mt: 0 }}>
                <Grid container id="city-selector">
                    <Grid item xs={12}>
                        <Typography sx={{ fontSize: 40 }} variant="h1" gutterBottom align="center">Weather Ecuador</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <SearchCityInput
                            cityInput={cityInput} // Estado actualizado
                            setCityInput={(city) => {
                                setCityInput(city); // Función corregida
                                handleCityChange(city);
                            }}
                            handleSearchCity={() => { }}
                        />
                    </Grid>
                    <Grid item id="indicators" alignItems="center" xs={12} py={2}>
                        <Grid item xs={12}>
                            <WeatherIndicator city={selectedCity.toUpperCase()} />
                        </Grid>
                    </Grid>
                    <Grid container id="forecast" direction="row">
                        <Grid item xs={12}>
                            <Typography variant="h2" align="center">Pronósticos</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container direction="row" spacing={2}>
                                <Grid item lg={8} xs={12} id="historical">
                                    <WeatherChart city={selectedCity} historicalType={historicalType} />
                                </Grid>
                                <Grid item lg={4} xs={12}>
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item xs={12}>
                                            <CitySelector
                                                historicalType={historicalType}
                                                setHistoricalType={setHistoricalType}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid container spacing={2} direction="column">
                                                {[1, 2, 3].map(index => (
                                                    <Grid item xs={12} sm={4} key={index}>
                                                        <ForecastIndicator
                                                            forecastData={forecastData}
                                                            historicalType={historicalType}
                                                            index={index}
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} id="summary">
                        <Typography variant="h2" align="left">Forecast Capital</Typography>
                        <WeatherTable cities={ecuadorianCities.filter(city => city !== selectedCity)} />
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
};

export default App;
