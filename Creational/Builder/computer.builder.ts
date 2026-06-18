import { Computer } from "./computer";

export class ComputerBuilder {
  private computerUsername: string;
  private cpu?: string;
  private gpu?: string;
  private storage?: string;
  private storageSpace?: number;
  private motherBoard?: string;
  private ramSpace?: number;

  constructor(computerUsername: string) {
    if (!computerUsername || computerUsername.trim() === "") {
      throw new Error("Computer username is required.");
    }
    this.computerUsername = computerUsername;
  }
  public withCpu(cpu: string): this {
    this.cpu = cpu;
    return this;
  }

  public withGpu(gpu: string): this {
    this.gpu = gpu;
    return this;
  }

  public withStorage(storage: string, storageSpace?: number): this {
    this.storage = storage;
    if (storageSpace !== undefined) {
      this.storageSpace = storageSpace;
    }
    return this;
  }

  public withStorageSpace(storageSpace: number): this {
    if (storageSpace < 0) throw new Error("Storage space cannot be negative.");
    this.storageSpace = storageSpace;
    return this;
  }

  public withMotherBoard(motherBoard: string): this {
    this.motherBoard = motherBoard;
    return this;
  }

  public withRamSpace(ramSpace: number): this {
    if (ramSpace <= 0) throw new Error("RAM space must be strictly positive.");
    this.ramSpace = ramSpace;
    return this;
  }

  public build(): Computer {
    if (this.storage && !this.storageSpace) {
      throw new Error("Storage type defined but storage space is missing.");
    }
    return new Computer(this);
  }
  public getComputerUsername(): string {
    return this.computerUsername;
  }
  public getCpu(): string | undefined {
    return this.cpu;
  }
  public getGpu(): string | undefined {
    return this.gpu;
  }
  public getStorage(): string | undefined {
    return this.storage;
  }
  public getStorageSpace(): number | undefined {
    return this.storageSpace;
  }
  public getMotherBoard(): string | undefined {
    return this.motherBoard;
  }
  public getRamSpace(): number | undefined {
    return this.ramSpace;
  }
}
