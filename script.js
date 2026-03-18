/*
OBJECTIF DU PROJET :
Créer un optimiseur Idle Miner Tycoon comme Bromine.

Améliorations futures :
- Ajouter vrai coût des upgrades
- Ajouter revenus par seconde réels
- Ajouter managers et boosts
- Ajouter sauvegarde (localStorage)
- Interface plus propre (UI)
- Ajouter graphiques
- Multi-mines

Logique actuelle :
- Production = level ^ 1.6
- Transport = elevator + warehouse
- Si transport bloque → upgrade transport
- Sinon → upgrade meilleur puits
*/

function productionMine(level) {
  const base = 5;
  const multiplier = 1.07;
  return base * Math.pow(multiplier, level);
}

function coutUpgrade(level) {
  const baseCost = 100;
  const growth = 1.15;
  return Math.floor(baseCost * Math.pow(growth, level));
}

function capaciteTransport(level) {
  const base = 20;
  const growth = 1.12;
  return Math.floor(base * Math.pow(growth, level));
}

class Mine {
  constructor(id, level = 1) {
    this.id = id;
    this.level = level;
  }

  get production() {
    return productionMine(this.level);
  }

  get nextCost() {
    return coutUpgrade(this.level);
  }
}

class Transport {
  constructor(level = 1) {
    this.level = level;
  }

  get capacity() {
    return capaciteTransport(this.level);
  }

  get nextCost() {
    return coutUpgrade(this.level);
  }
}

let mines = [];
let elevator = new Transport(1);
let warehouse = new Transport(1);

function afficherMines() {
  const container = document.getElementById("mineList");
  container.innerHTML = "";

  mines.forEach(mine => {
    const div = document.createElement("div");
    div.className = "mine";

    div.innerHTML = `
      <p>Puits ${mine.id} — Niveau : ${mine.level}</p>
      <p>Production : ${mine.production.toFixed(2)}</p>
      <button onclick="upgradeMine(${mine.id})">Upgrade</button>
    `;

    container.appendChild(div);
  });
}

function afficherTransport() {
  document.getElementById("elevatorLevel").textContent = elevator.level;
  document.getElementById("warehouseLevel").textContent = warehouse.level;
}

function ajouterMine() {
  const id = mines.length + 1;
  mines.push(new Mine(id));
  afficherMines();
}

function upgradeMine(id) {
  const mine = mines.find(m => m.id === id);
  if (!mine) return;

  mine.level++;
  afficherMines();
}

function upgradeElevator() {
  elevator.level++;
  afficherTransport();
}

function upgradeWarehouse() {
  warehouse.level++;
  afficherTransport();
}

afficherTransport();
afficherMines();
