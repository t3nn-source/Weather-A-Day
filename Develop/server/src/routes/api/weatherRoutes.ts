import { Router } from 'express';
const router = Router();

 import HistoryService from '../../service/historyService.js';
 import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: any, res: any) => {
  // TODO: GET weather data from city name
  const weatherService = new WeatherService(req.body.cityName);
  weatherService
    .getWeatherForCity(req.body.cityName)
    .then((forecastArray) => {
      res.json(forecastArray);
    })
    .catch((err) => {
      console.log(err);
    });
  // TODO: save city to search history
  HistoryService.addCity(req.body.cityName);
});

// TODO: GET search history
router.get('/history', async (_req: any, res: any) => {
  HistoryService.getCities()
    .then((cities) => {
      res.json(cities);
    }
    )
    .catch((err) => {
      console.log(err);
    }
    );
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: any, res: any) => {
  HistoryService.removeCity(req.params.id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      console.log(err);
    });
});

export default router;
