import { Enemy, Goblin, Orc } from "./enemy";

export abstract class Spawner {
  protected abstract createEnemy(): Enemy;

  public spawn(): void {
    const enemy: Enemy = this.createEnemy();
    console.log("A portal opens...");
    enemy.attack();
  }
}

export class OrcSpawner extends Spawner {
  protected createEnemy(): Enemy {
    return new Orc();
  }
}

export class GoblinSpawner extends Spawner {
  protected createEnemy(): Enemy {
    return new Goblin();
  }
}
