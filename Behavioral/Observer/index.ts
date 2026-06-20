import { Laptop } from "./laptop";
import { Phone } from "./phone";
import { WeatherStation } from "./weather-station";

const weatherStation = new WeatherStation();

const myPhone = new Phone();
const myLaptop = new Laptop();

weatherStation.addObserver(myLaptop);
weatherStation.addObserver(myPhone);


weatherStation.setTemperature(25)
weatherStation.setTemperature(30)