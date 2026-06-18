export class Configuration {
  private settings: Array<{ key: string; value: number | boolean | string }> = [];
  constructor(executor: (set: (key: string, value: number | boolean | string) => void) => void) {
    const set = (key: string, value: number | boolean | string) => {
      this.settings.push({ key, value });
    };
    executor(set);
    Object.freeze(this);
  }
  getKey(key: string) {
    return this.settings.find((element) => element.key === key);
  }
  getAll() {
    return this.settings;
  }
}
