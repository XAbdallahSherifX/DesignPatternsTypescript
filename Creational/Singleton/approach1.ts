class Dog {
  private name: string | undefined;

  public getName(): string | undefined {
    return this.name;
  }

  public setName(name: string) {
    this.name = name;
  }
}

export default new Dog();

