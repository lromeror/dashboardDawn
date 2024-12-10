import React from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

interface Indicator {
  title?: string;
  subtitle?: string;
  value?: string;
}

const IndicatorWeather: React.FC<Indicator> = ({ title, subtitle, value }) => {
  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {title && (
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          {title}
        </Typography>
      )}
      {value && (
        <Typography component="p" variant="h4">
          {value}
        </Typography>
      )}
      {subtitle && (
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
};

export default IndicatorWeather;

