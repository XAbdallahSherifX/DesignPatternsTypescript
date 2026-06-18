class Dog {
  private name: string | undefined;

  private static instance: Dog;

  private constructor() {}

  public static getInstance() {
    if (!Dog.instance) {
      Dog.instance = new Dog();
    }
    return Dog.instance;
  }

  public getName() {
    return this.name;
  }

  public setName(name: string) {
    this.name = name;
  }
}
