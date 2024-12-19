import React from 'react';
import { Paper, Typography, Box, Grid } from '@mui/material';
import { WiThermometer, WiHumidity, WiBarometer, WiStrongWind, WiRaindrop, WiFog, WiCloudy } from 'react-icons/wi';

interface IndicatorProps {
  title: string;
  value: string | number;
  lgSize?: number;
  xsSize?: number;
}

const getIconByTitle = (title: string) => {
    switch (title.toLowerCase()) {
      case 'temperatura actual':
      case 'sensación térmica':
        return <WiThermometer size={32} />;
      case 'humedad':
        return <WiHumidity size={32} />;
      case 'condición':
        return <WiCloudy size={32} />;
      case 'presión':
        return <WiBarometer size={32} />;
      case 'viento':
        return <WiStrongWind size={32} />;
      case 'visibilidad':
        return <WiFog size={32} />;
      case 'lluvia':
        return <WiRaindrop size={32} />;
      default:
        return <WiCloudy size={32} />;
    }
  };

  const Indicator: React.FC<IndicatorProps> = ({ title, value, lgSize = 12, xsSize = 6 }) => {
    const resolvedIcon = getIconByTitle(title);
  
    return (
      <Grid item lg={lgSize} xs={xsSize} sx={{ display: 'flex' }}>
        <Paper
          elevation={3} 
          sx={{
            py: 2,
            textAlign: 'center',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            flexGrow: 1,
            transition: 'background-color 0.3s, box-shadow 0.3s',
            '&:hover': {
              backgroundColor: '#333',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            },
            backgroundColor: '#5b78b2', 
            color: '#fff',
            fontFamily: 'Montserrat', 
            fontWeight: '600',
          }}
        >
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          <Box sx={{ color: '#999', fontSize: '24px' }}>{resolvedIcon}</Box>
          <Typography variant="h5">{value}</Typography>
        </Paper>
      </Grid>
    );
  };
  
  export default Indicator;