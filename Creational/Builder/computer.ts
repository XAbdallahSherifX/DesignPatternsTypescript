import { ComputerBuilder } from "./computer.builder";

export class Computer {
  public readonly computerUsername: string;
  public readonly cpu?: string;
  public readonly gpu?: string;
  public readonly storage?: string;
  public readonly storageSpace?: number;
  public readonly motherBoard?: string;
  public readonly ramSpace?: number;

  constructor(builder: ComputerBuilder) {
    this.computerUsername = builder.getComputerUsername();
    this.cpu = builder.getCpu();
    this.gpu = builder.getGpu();
    this.motherBoard = builder.getMotherBoard();
    this.ramSpace = builder.getRamSpace();
    this.storage = builder.getStorage();
    this.storageSpace = builder.getStorageSpace();
  }
}
