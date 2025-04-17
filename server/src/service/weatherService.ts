import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  humidity: number;
  windSpeed: number;
  

  constructor(city: string, date: string, icon: string, iconDescription: string, tempF: number, humidity: number, windSpeed: number) {
    this.city = city
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string = 'https://api.openweathermap.org';
  private apiKey: string | undefined;
  private cityName: string;

  constructor(cityName: string) {
    this.apiKey = process.env.API_KEY;
    if (!this.apiKey) {
      throw new Error('API key is missing. Please set the API_KEY environment variable.');
    }
    this.cityName = cityName;
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData() {
    try {
      const response = await fetch(this.buildGeocodeQuery());
      if (!response.ok) {
        throw new Error(`Failed to fetch location data: ${response.status} ${response.statusText} ${this.buildGeocodeQuery()}`);
      }
      const data = await response.json();
      return this.destructureLocationData(data[0]);
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw error;
    }
  }
  // TODO: Create destructureLocationData method
   private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
   }
  // TODO: Create buildGeocodeQuery method
   private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
   }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }
  // TODO: Create fetchAndDestructureLocationData method
   private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData();
    return this.destructureLocationData(locationData);}
  // TODO: Create fetchWeatherData method
   private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const data = await response.json();
    return data;
   }
  // TODO: Build parseCurrentWeather method
   private parseCurrentWeather(response: any) {
    const city = response.city.name;
    const entry = response.list;

    const date = new Date(entry[0].dt * 1000).toLocaleDateString();
    const icon = entry[1].weather[0].icon;
    const iconDescription = entry[1].weather[0].description;
    const tempF = entry[0].main.temp;
    const humidity = entry[0].main.humidity; 
    const windSpeed = entry[3].wind.speed;

    
    return new Weather(city, date, icon, iconDescription, tempF, humidity, windSpeed);
   }
  // TODO: Complete buildForecastArray method
   private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forcast : Weather[] = [];
    const city = currentWeather.city;
    
    forcast.push(currentWeather);
    const dailyForecasts = weatherData.filter((entry: any) =>
      entry.dt_txt.includes('12:00:00')
    );
    for (const entry of dailyForecasts) {
      const weather = new Weather(
        city,
        new Date(entry.dt * 1000).toLocaleDateString(),
        entry.weather[0].icon,
        entry.weather[0].description,
        entry.main.temp,
        entry.main.humidity,
        entry.wind.speed
        
      );
      
      forcast.push(weather);
    }
    
    return forcast;
   }
  // TODO: Complete getWeatherForCity method
   async getWeatherForCity(city: string) {
    this.cityName = city;
    const locationData = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(locationData);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);

    
    return forecastArray;
   }
}
export default  WeatherService;