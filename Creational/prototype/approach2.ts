class Owner {
  constructor(public name: string) {}

  public clone(): Owner {
    return new Owner(this.name);
  }
}

class ComplexCat {
  private name: string;
  private toys: string[];
  private details: { age: number };
  private owner: Owner;

  constructor(name: string, toys: string[], details: { age: number }, owner: Owner) {
    this.name = name;
    this.toys = toys;
    this.details = details;
    this.owner = owner;
  }

  public clone(): ComplexCat {
    return new ComplexCat(this.name, [...this.toys], structuredClone(this.details), this.owner.clone());
  }
}
