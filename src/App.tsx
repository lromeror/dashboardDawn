import './App.css'
import Grid from '@mui/material/Grid2' 
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import Item from "./interface/Item";
import { useEffect, useState } from 'react';

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {
   const [items, setItems] = useState<Item[]>([]);
   let [indicators, setIndicators] = useState<Indicator[]>([]);
   let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"));

   useEffect(() => {
    const apiURL = 'https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=45f9bc3282db66f8b0525afe1ea11bd9';

    fetch(apiURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        return response.text();
      })
      .then((data) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'application/xml');
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

        setItems(dataToItems.slice(0, 6));
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    let request = async () => {
       let savedTextXML = localStorage.getItem("openWeatherMap") || "";
       let expiringTime = localStorage.getItem("expiringTime");
       let nowTime = (new Date()).getTime();
       if(expiringTime === null || nowTime > parseInt(expiringTime)) {
        let API_KEY = "45f9bc3282db66f8b0525afe1ea11bd9"
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
        let savedTextXML = await response.text();
        let hours = 0.01
        let delay = hours * 3600000
        let expiringTime = nowTime + delay

        localStorage.setItem("openWeatherMap", savedTextXML)
        localStorage.setItem("expiringTime", expiringTime.toString())
        localStorage.setItem("nowTime", nowTime.toString())
        localStorage.setItem("expiringDateTime", new Date(expiringTime).toString())
        localStorage.setItem("nowDateTime", new Date(nowTime).toString())

        setOWM(savedTextXML)
       }

       if(savedTextXML) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");
        let dataToIndicators : Indicator[] = new Array<Indicator>();

        let name = xml.getElementsByTagName("name")[0].innerHTML || ""
        dataToIndicators.push({"title":"Location", "subtitle": "City", "value": name})

        let location = xml.getElementsByTagName("location")[1]
        let latitude = location.getAttribute("latitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Latitude", "value": latitude })

        let longitude = location.getAttribute("longitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Longitude", "value": longitude })

        let altitude = location.getAttribute("altitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Altitude", "value": altitude })

        console.log(dataToIndicators)
        setIndicators(dataToIndicators)
       }
    }

    request();

  }, [owm]);

  let renderIndicators = () => {
    return indicators.map(
      (indicator, idx) => (
        <Grid key={idx} size={{ xs: 12, md: 3 }}>
            <IndicatorWeather 
                title={indicator["title"]} 
                subtitle={indicator["subtitle"]} 
                value={indicator["value"]} />
        </Grid>
      )
    );
  }

  return (
    <Grid container spacing={5}>
        {renderIndicators()}
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <ControlWeather/>
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
              <TableWeather itemsIn={items} />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <LineChartWeather/>
        </Grid>
    </Grid>
  );
}

export default App;
