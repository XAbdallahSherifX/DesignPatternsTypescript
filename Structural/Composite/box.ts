import { IProduct } from "./product.ts";

export class Box implements IProduct {
  private readonly name: string;
  private products: IProduct[];

  constructor(name: string, products: IProduct[] = []) {
    this.name = name;
    this.products = [...products];
  }

  public add(product: IProduct): void {
    this.products.push(product);
  }
  public remove(product: IProduct): void {
    const index = this.products.indexOf(product);
    if (index !== -1) {
      this.products.splice(index, 1);
    }
  }
  public getPrice(): number {
    return this.products.reduce((acc, current) => acc + current.getPrice(), 0);
  }
}
