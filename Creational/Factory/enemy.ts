export interface Enemy {
  attack: () => void;
}

export class Orc implements Enemy {
  attack() {
    console.log("Orc is attacking");
  }
}
export class Goblin implements Enemy {
  attack() {
    console.log("Goblin is attacking");
  }
}

