import { ComputerBuilder } from "./computer.builder";
const computer = new ComputerBuilder("Abdallah").withCpu("Cpu1").withGpu("gpu1").build();

console.log(computer);
