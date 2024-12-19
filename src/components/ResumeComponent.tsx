import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

interface ResumeComponentProps {
  city: string;
  country: string;
  condition: string;
  icon: string;
}

const ResumeComponent: React.FC<ResumeComponentProps> = ({ city, country, condition }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 60000);
    return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar el componente
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        background: 'linear-gradient(to right,rgb(251, 188, 71),rgb(0, 169, 254))', // Fondo degradado
        color: '#fff', // Color de texto blanco
      }}
    >
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid
          item
          lg={12}
          xs={12}
          id="izquierda"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'auto',
          }}
        >
          <Grid container sx={{ textAlign: 'center' }}>
            <Grid item xs={12}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)', // Sombra en el texto
                }}
              >
                {city} ({country})
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                }}
              >
                {formattedTime}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="body1"
                sx={{
                  fontStyle: 'italic',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                }}
              >
                {condition}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ResumeComponent;
