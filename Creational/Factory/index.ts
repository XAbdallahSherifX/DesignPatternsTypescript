import { GoblinSpawner, OrcSpawner, Spawner } from "./spawner";

function runGameLevel() {
  console.log("--- Level 1 Starts ---");
  
  let currentSpawner: Spawner = new GoblinSpawner();
  currentSpawner.spawn();

  console.log("\n--- Level 2 Starts ---");

  currentSpawner = new OrcSpawner();
  currentSpawner.spawn();
}


runGameLevel();
