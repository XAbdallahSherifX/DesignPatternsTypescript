import { Observer } from "./interface";

export class Laptop implements Observer {
  update(temperature: number) {
    console.log(`Laptop is notified that the temperature is changed to ${temperature}`);
  }
}
