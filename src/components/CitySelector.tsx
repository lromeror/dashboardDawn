import React from 'react';
import { Grid, MenuItem, Select } from '@mui/material';

interface CitySelectorProps {
    historicalType: string;
    setHistoricalType: React.Dispatch<React.SetStateAction<string>>;
}

const CitySelector: React.FC<CitySelectorProps> = ({
    historicalType,
    setHistoricalType,
}) => {
    return (
        <Grid container direction="column" spacing={1}>
    
    <Grid item>
        <Select
            value={historicalType}
            onChange={(e) => setHistoricalType(e.target.value)}
            displayEmpty
            fullWidth
            sx={{ mb: 4 }}
        >
            <MenuItem value="temperature">Temperatura</MenuItem>
            <MenuItem value="humidity">Humedad</MenuItem>
            <MenuItem value="precipitation">Precipitación</MenuItem>
        </Select>
    </Grid>
</Grid>
    );
};

export default CitySelector;
