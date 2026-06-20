export class Iterator<T> {
  private data: Array<T>;
  private index: number = 0;

  constructor(data: T[]) {
    this.data = data;
  }

  next() {
    return this.index < this.data.length ? this.data[this.index++] : undefined;
  }
  prev() {
    return this.index > 0 ? this.data[--this.index] : undefined;
  }
  start() {
    return this.data[(this.index = 0)];
  }
  end() {
    return this.data[(this.index = this.data.length - 1)];
  }
}
