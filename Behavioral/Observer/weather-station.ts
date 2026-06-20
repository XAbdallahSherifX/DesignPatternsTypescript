import { Observer, Subject } from "./interface";

export class WeatherStation implements Subject {
  private temperature: number = 0;
  private observers: Observer[] = [];

  constructor() {}

  addObserver(observer: Observer) {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  private notifyObservers(temperature: number) {
    this.observers.forEach((observer) => {
      observer.update(temperature);
    });
  }

  setTemperature(temperature: number) {
    this.temperature = temperature;
    this.notifyObservers(temperature);
  }
}
