import React from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

const ecuadorianCities = [
  'Cuenca', 'Guaranda', 'Azogues', 'Tulcán', 'Riobamba', 'Latacunga',
  'Machala', 'Puerto Baquerizo Moreno', 'Guayaquil',
  'Ibarra', 'Loja', 'Babahoyo', 'Portoviejo', 'Macas', 'Tena', 'Puyo', 'Quito', 'Santa Elena',
  'Nueva Loja', 'Ambato', 'Zamora'
];

interface SearchCityInputProps {
  cityInput: string;
  setCityInput: (city: string) => void;
  handleSearchCity: () => void;
}

const SearchCityInput: React.FC<SearchCityInputProps> = ({ cityInput, setCityInput, handleSearchCity }) => {
  const handleCityChange = (event: SelectChangeEvent<string>) => {
    const selectedCity = event.target.value;
    setCityInput(selectedCity);
    handleSearchCity();
  };

  return (
    <Grid container direction="row" spacing={1} alignItems="stretch">
      <Grid item xs={12} lg={12}>
        <FormControl fullWidth>
          <InputLabel id="city-select-label">Buscar ciudad</InputLabel>
          <Select
            labelId="city-select-label"
            id="city-select"
            value={cityInput}
            label="Buscar ciudad"
            onChange={handleCityChange}
          >
            {ecuadorianCities.map((cityName) => (
              <MenuItem key={cityName} value={cityName}>
                {cityName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default SearchCityInput;
