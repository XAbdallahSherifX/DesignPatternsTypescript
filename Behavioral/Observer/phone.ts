import { Observer } from "./interface";

export class Phone implements Observer {
  update(temperature: number) {
    console.log(`Phone is notified that the temperature is changed to ${temperature}`);
  }
}
