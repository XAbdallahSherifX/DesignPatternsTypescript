class Cat {
  private name: string;
  private weight: number;

  constructor(name: string, weight: number) {
    this.name = name;
    this.weight = weight;
  }

  public getName() {
    return this.name;
  }
  public setName(name: string) {
    this.name = name;
  }


  public clone(): Cat {
    return new Cat(this.name, this.weight);
  }
}

const originalCat = new Cat("Whiskers", 10);
const clonedCat = originalCat.clone();

