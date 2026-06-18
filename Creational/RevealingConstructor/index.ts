import { Configuration } from "./config";

const config = new Configuration((set) => {
  set("Port", 3000);
});
console.log(config.getAll());
