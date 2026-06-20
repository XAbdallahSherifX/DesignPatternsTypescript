# TypeScript Observer Pattern: The Weather Station

This repository demonstrates how to implement the Observer Design Pattern in TypeScript using a weather station that automatically broadcasts temperature updates to connected devices.

## What is the Observer Pattern?

The Observer Pattern is a behavioral design pattern that defines a one-to-many subscription mechanism. It allows multiple objects to listen to and react to events or state changes happening in another object.

Instead of objects constantly checking or "polling" another object to see if its state has changed, the core object (the Subject) takes responsibility for notifying all of its dependents (the Observers) the moment a change occurs.

**Common use cases for the Observer Pattern include:**

* **Event Listeners/UI Components:** Think of a button click in a browser. The button (Subject) is clicked, and all assigned event listener functions (Observers) are notified and executed.
* **Publish/Subscribe Systems:** Newsletter mailing lists, push notifications on your phone, or social media feeds where followers (Observers) receive updates when an account (Subject) posts new content.
* **MVC (Model-View-Controller) Architecture:** When the data in a Model changes, it automatically notifies all attached Views so they can re-render and display the fresh data.

---

## The Architecture

To understand how this repository works, we can look at the code divided into four distinct roles: The Interfaces, The Subject, The Observers, and The Client Code.

### 1. The Interfaces (`interface.ts`)

Interfaces establish the contract between the Subject and the Observers. The Subject doesn't need to know *what* the Observers are (a phone, a laptop, a smart fridge)—it only needs to know that they implement the `Observer` (or `Device`) interface, guaranteeing they have an `update` method.

```typescript
// The contract for the Observers
export interface Device {
  update: (temperature: number) => void;
}

// The contract for the Subject
export interface Subject {
  addObserver: (observer: Device) => void;
  removeObserver: (observer: Device) => void;
}

```

### 2. The Subject (`weather-station.ts`)

The "Subject" holds the core state (the temperature) and manages the list of subscribers. It implements methods to attach and detach observers. Most importantly, when its state changes via `setTemperature()`, it loops through its internal array of observers and calls their `update()` methods.

Notice that the `WeatherStation` knows absolutely nothing about phones or laptops. It only knows about the `Device` interface.

```typescript
import { Device, Subject } from "./interface";

export class WeatherStation implements Subject {
  private temperature: number = 0;
  private observers: Device[] = [];

  constructor() {}

  addObserver(observer: Device) {
    this.observers.push(observer);
  }

  removeObserver(observer: Device) {
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
    this.notifyObservers(temperature); // Broadcast the change
  }
}

```

### 3. The Observers (`laptop.ts` & `phone.ts`)

The "Observers" are the concrete classes that react to the updates. They implement the `Device` interface, ensuring the Subject can interact with them predictably. When their `update()` method is triggered by the Subject, they execute their own specific logic (like displaying a notification on a screen).

```typescript
import { Device } from "./interface";

// laptop.ts
export class Laptop implements Device {
  update(temperature: number) {
    console.log(`Laptop is notified that the temperature is changed to ${temperature}`);
  }
}

// phone.ts
export class Phone implements Device {
  update(temperature: number) {
    console.log(`Phone is notified that the temperature is changed to ${temperature}`);
  }
}

```

### 4. The Client Code (`index.ts`)

The "Client Code" wires everything together. It initializes the Subject, creates the specific Observers, subscribes them to the Subject, and triggers the state changes to demonstrate the pattern in action.

```typescript
import { Laptop } from "./laptop";
import { Phone } from "./phone";
import { WeatherStation } from "./weather-station";

// 1. Create the Subject
const weatherStation = new WeatherStation();

// 2. Create the Observers
const myPhone = new Phone();
const myLaptop = new Laptop();

// 3. Subscribe Observers to the Subject
weatherStation.addObserver(myLaptop);
weatherStation.addObserver(myPhone);

console.log("--- Updating Temperature to 500 ---");
// 4. Trigger state change - both devices are automatically notified
weatherStation.setTemperature(500); 

console.log("\n--- Removing Phone and Updating to 30 ---");
// 5. Unsubscribe an observer
weatherStation.removeObserver(myPhone);
weatherStation.setTemperature(30); // Only the Laptop is notified now

```

---

## Why use this approach? (The Magic of the Observer Pattern)

You might wonder: Why go through all this trouble instead of just having the `WeatherStation` call `myPhone.update()` directly?

* **Loose Coupling:** The Subject and Observers can interact without knowing anything about each other's underlying classes. You can rewrite the entire `Phone` class, and as long as it still implements the `Device` interface, the `WeatherStation` won't break.
* **Open/Closed Principle:** You can introduce new subscriber classes (like a `SmartWatch` or a `DigitalBillboard`) without changing a single line of code inside the `WeatherStation` class.
* **Dynamic Relationships:** You can establish and break relationships at runtime. Users can turn their weather notifications on (`addObserver`) or off (`removeObserver`) whenever they want, without hardcoding those states into the application logic.

## Summary

* **Interfaces** (`interface.ts`) define the required methods to ensure the Subject and Observers can communicate predictably.
* **Subject** (`weather-station.ts`) holds the state and is responsible for managing the list of subscribers and broadcasting updates.
* **Observers** (`laptop.ts`, `phone.ts`) react independently whenever the Subject notifies them of a change.
* **Client Code** (`index.ts`) ties it all together by associating the Observers with the Subject and initiating state changes.

Use this pattern when a change to one object requires changing others, and you don't know ahead of time how many objects need to be changed or what specific classes they are.