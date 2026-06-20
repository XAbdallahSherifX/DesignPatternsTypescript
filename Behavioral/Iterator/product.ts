export class Product {
  constructor(
    private name: string,
    private price: number
  ) {}

  productInfo() {
    console.log(`This Product (${this.name}) costs ${this.price}`);
  }
}
