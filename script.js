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
*/

// --- FORMULES ---

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

// --- CLASSES ---

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

// --- ÉTAT DU JEU ---

let mines = [];
let elevator = new Transport(1);
let warehouse = new Transport(1);

// --- RECOMMANDATION ---

function meilleureAmelioration() {
  if (mines.length === 0) {
    return "Ajoute au moins un puits.";
  }

  const totalProduction = mines.reduce((sum, m) => sum + m.production, 0);
  const transportCapacity = elevator.capacity + warehouse.capacity;

  if (totalProduction > transportCapacity) {
    if (elevator.nextCost < warehouse.nextCost) {
      return "Upgrade Ascenseur (transport bloque)";
    } else {
      return "Upgrade Dépôt (transport bloque)";
    }
  }

  let meilleur = null;

  mines.forEach(mine => {
    const gain = productionMine(mine.level + 1) - mine.production;
    const ratio = gain / mine.nextCost;

    if (!meilleur || ratio > meilleur.ratio) {
      meilleur = { id: mine.id, ratio };
    }
  });

  return `Upgrade Puits ${meilleur.id}`;
}

// --- AFFICHAGE ---

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

function afficherRecommandation() {
  const reco = meilleureAmelioration();
  document.getElementById("recommandation").textContent = "👉 " + reco;
}

// --- ACTIONS ---

function ajouterMine() {
  const id = mines.length + 1;
  mines.push(new Mine(id));
  afficherMines();
  afficherRecommandation();
}

function upgradeMine(id) {
  const mine = mines.find(m => m.id === id);
  if (!mine) return;

  mine.level++;
  afficherMines();
  afficherRecommandation();
}

function upgradeElevator() {
  elevator.level++;
  afficherTransport();
  afficherRecommandation();
}

function upgradeWarehouse() {
  warehouse.level++;
  afficherTransport();
  afficherRecommandation();
}

// --- INITIALISATION ---

afficherTransport();
afficherMines();
afficherRecommandation();
