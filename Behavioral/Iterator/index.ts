import { Product } from "./product";
import { Iterator } from "./iterator";

// 1. Setup the raw data
const inventory = [
  new Product("Laptop", 1200),
  new Product("Smartphone", 800),
  new Product("Headphones", 150),
  new Product("Monitor", 300)
];

// 2. Instantiate the Iterator
const catalogIterator = new Iterator<Product>(inventory);

// 3. Traverse the collection safely
console.log("--- Moving Forward ---");
let currentProduct = catalogIterator.next();
while (currentProduct) {
  currentProduct.productInfo();
  currentProduct = catalogIterator.next();
}

console.log("\n--- Jumping to Start ---");
const first = catalogIterator.start();
first.productInfo();

console.log("\n--- Moving Backward from End ---");
catalogIterator.end(); // Move index to the end
let previousProduct = catalogIterator.prev();
while (previousProduct) {
  previousProduct.productInfo();
  previousProduct = catalogIterator.prev();
}
