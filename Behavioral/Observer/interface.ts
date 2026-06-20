
export interface Observer {
  update: (temperature: number) => void;
}


export interface Subject {
  addObserver: (observer: Observer) => void;
  removeObserver: (observer: Observer) => void;
}
