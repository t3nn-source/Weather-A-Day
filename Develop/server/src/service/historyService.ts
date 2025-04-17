// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}


import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 
import { v4 as uuidv4 } from 'uuid';
// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
   private async read() {
    return await fs.readFile(path.join(__dirname, '../../db/searchHistory.json'), {
      flag: 'a+',
      encoding: 'utf-8',
    });
   }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
   private async write(cities: City[]) {
    return await fs.writeFile(path.join(__dirname, '../../db/searchHistory.json'),
      JSON.stringify(cities, null, 2),
      { encoding: 'utf-8' }
    );
   }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
   async getCities() {
    const data = await this.read();
    const cities: City[] = JSON.parse(data);
    return cities.map((city: City) => {
      return {
        name: city.name,
        id: city.id,
      };
    }
    );
   }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
   async addCity(city: string) {
    const cities = await this.getCities();
    const newCity = { name: city, id: uuidv4() };
    cities.push(newCity);
    await this.write(cities);
   }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
   async removeCity(id: string) {
    const cities = await this.getCities();
    const updatedCities = cities.filter((city: City) => city.id !== id);
    await this.write(updatedCities);
   }
}

export default new HistoryService();
