import { Box } from "./box.ts";
import { Product } from "./product.ts";

const product1 = new Product("product1", 200);
const product2 = new Product("product2", 200);
const product3 = new Product("product3", 200);
const product4 = new Product("product4", 200);

const box1 = new Box("box1", [product1, product2, product3, product4]);
const box2 = new Box("box2", [box1, product4]);
console.log(box2.getPrice());
