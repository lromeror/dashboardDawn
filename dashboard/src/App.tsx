
import './App.css'

//Grid 2

import Grid from '@mui/material/Grid2' 
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import Item from "./interface/Item";
{/* Hooks */ }
import { useEffect, useState } from 'react';
 

 interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {
   {/* Variable de estado y función de actualización */}
   const [items, setItems] = useState<Item[]>([]);
   let [indicators, setIndicators] = useState<Indicator[]>([])
   let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))
   useEffect(() => {
    // URL del API
    const apiURL = 'https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=49a55d3a262760dea88cf2ac7628e71e';

    // Fetch para obtener los datos
    fetch(apiURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        return response.text(); // Obtener el XML como texto
      })
      .then((data) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'application/xml');

        // Extraer datos relevantes
        const timeElements = xmlDoc.getElementsByTagName('time');
        const dataToItems: Item[] = [];

        for (let i = 0; i < timeElements.length; i++) {
          const time = timeElements[i];
          const dateStart = time.getAttribute('from') || '';
          const dateEnd = time.getAttribute('to') || '';
          const precipitation = time.querySelector('precipitation')?.getAttribute('probability') || '0';
          const humidity = time.querySelector('humidity')?.getAttribute('value') || '0';
          const clouds = time.querySelector('clouds')?.getAttribute('all') || '0';

          dataToItems.push({ dateStart, dateEnd, precipitation, humidity, clouds });
        }

        // Actualizar el estado
        setItems(dataToItems.slice(0, 6)); // Tomar solo los primeros 6 elementos
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    let request = async () => {
       {/* Referencia a las claves del LocalStorage: openWeatherMap y expiringTime */}
       let savedTextXML = localStorage.getItem("openWeatherMap") || "";
       let expiringTime = localStorage.getItem("expiringTime");
       let nowTime = (new Date()).getTime();
       if(expiringTime === null || nowTime > parseInt(expiringTime)) {
        {/* Request */}
        let API_KEY = "49a55d3a262760dea88cf2ac7628e71e"
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
        let savedTextXML = await response.text();
        {/* Tiempo de expiración */}
        let hours = 0.01
        let delay = hours * 3600000
        let expiringTime = nowTime + delay


        {/* En el LocalStorage, almacene el texto en la clave openWeatherMap, estampa actual y estampa de tiempo de expiración */}
        localStorage.setItem("openWeatherMap", savedTextXML)
        localStorage.setItem("expiringTime", expiringTime.toString())
        localStorage.setItem("nowTime", nowTime.toString())

        {/* DateTime */}
        localStorage.setItem("expiringDateTime", new Date(expiringTime).toString())
        localStorage.setItem("nowDateTime", new Date(nowTime).toString())

        {/* Modificación de la variable de estado mediante la función de actualización */ }
        setOWM( savedTextXML )
       }
       if( savedTextXML ) {
        {/* XML Parser */}
        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");
         {/* Arreglo para agregar los resultados */}

         let dataToIndicators : Indicator[] = new Array<Indicator>();

         {/* 
             Análisis, extracción y almacenamiento del contenido del XML 
             en el arreglo de resultados
         */}

         let name = xml.getElementsByTagName("name")[0].innerHTML || ""
         dataToIndicators.push({"title":"Location", "subtitle": "City", "value": name})

         let location = xml.getElementsByTagName("location")[1]

         let latitude = location.getAttribute("latitude") || ""
         dataToIndicators.push({ "title": "Location", "subtitle": "Latitude", "value": latitude })

         let longitude = location.getAttribute("longitude") || ""
         dataToIndicators.push({ "title": "Location", "subtitle": "Longitude", "value": longitude })

         let altitude = location.getAttribute("altitude") || ""
         dataToIndicators.push({ "title": "Location", "subtitle": "Altitude", "value": altitude })

         console.log( dataToIndicators )
         setIndicators( dataToIndicators )
       }
    }

    request();

},[owm])
let renderIndicators = () => {

  return indicators
          .map(
              (indicator, idx) => (
                  <Grid key={idx} size={{ xs: 12, md: 3 }}>
                      <IndicatorWeather 
                          title={indicator["title"]} 
                          subtitle={indicator["subtitle"]} 
                          value={indicator["value"]} />
                  </Grid>
              )
          )
   
}
  return (
    <Grid container spacing={5}>

        {renderIndicators()}

        {/* Tabla */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Grid Anidado */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <ControlWeather/>
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
            <TableWeather itemsIn={ items } />
            </Grid>
          </Grid>
        </Grid>

        {/* Gráfico */}
        <Grid size={{ xs: 12, md: 4 }}>
          <LineChartWeather/>
        </Grid>
        
    </Grid>
    
)
}

export default App
