/*
OPTIMISEUR IDLE MINER TYCOON — VERSION MULTI-MINE
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

  get gain() {
    return productionMine(this.level + 1) - productionMine(this.level);
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

// --- MULTI-MINE ---

let minesData = {};
let mineActive = 1;

function creerNouvelleMine(id) {
  return {
    mines: [],
    elevator: new Transport(1),
    warehouse: new Transport(1)
  };
}

// --- SAUVEGARDE ---

function sauvegarder() {
  localStorage.setItem("idleMinerSave_" + mineActive, JSON.stringify(minesData[mineActive]));
}

function chargerMine(id) {
  const data = localStorage.getItem("idleMinerSave_" + id);

  if (data) {
    minesData[id] = JSON.parse(data);

    minesData[id].mines = minesData[id].mines.map(m => new Mine(m.id, m.level));
    minesData[id].elevator = new Transport(minesData[id].elevator.level);
    minesData[id].warehouse = new Transport(minesData[id].warehouse.level);
  } else {
    minesData[id] = creerNouvelleMine(id);
  }
}

// --- MENU MULTI-MINE ---

function afficherMenuMines() {
  const nav = document.getElementById("mineSelector");
  nav.innerHTML = "";

  for (let id in minesData) {
    const btn = document.createElement("button");
    btn.textContent = "Mine " + id;
    btn.onclick = () => changerMine(id);
    nav.appendChild(btn);
  }

  const addBtn = document.createElement("button");
  addBtn.textContent = "+ Ajouter une mine";
  addBtn.onclick = ajouterMineGlobale;
  nav.appendChild(addBtn);
}

function changerMine(id) {
  mineActive = id;
  sauvegarder();
  chargerMine(id);
  afficherTout();
}

function ajouterMineGlobale() {
  const newId = Object.keys(minesData).length + 1;
  minesData[newId] = creerNouvelleMine(newId);
  sauvegarder();
  afficherMenuMines();
}

function coutNouveauPuits() {
  const data = minesData[mineActive];
  const nb = data.mines.length;

  // Formule simple : chaque nouveau puits coûte 500 * (nb + 1)
  return 500 * (nb + 1);
}

// --- RECOMMANDATION ---

function meilleureAmelioration() {
  const data = minesData[mineActive];
  const mines = data.mines;

  // Aucun puits → débloquer un puits
  if (mines.length === 0) return "Débloquer un nouveau puits";

  const totalProduction = mines.reduce((sum, m) => sum + m.production, 0);
  const transportCapacity = data.elevator.capacity + data.warehouse.capacity;

  // Transport bloque ?
  if (totalProduction > transportCapacity) {
    if (data.elevator.nextCost < data.warehouse.nextCost) {
      return "Upgrade Ascenseur (transport bloqué)";
    } else {
      return "Upgrade Dépôt (transport bloqué)";
    }
  }

  // Meilleur upgrade de puits
  let meilleur = null;

  mines.forEach(mine => {
    const ratio = mine.gain / mine.nextCost;
    if (!meilleur || ratio > meilleur.ratio) {
      meilleur = { id: mine.id, ratio, cost: mine.nextCost };
    }
  });

  // Coût d’un nouveau puits
  const costNew = coutNouveauPuits();

  // Si un nouveau puits est plus intéressant que le meilleur upgrade
  if (costNew < meilleur.cost) {
    return "Débloquer un nouveau puits";
  }

  return `Upgrade Puits ${meilleur.id}`;
}


// --- AFFICHAGE ---

function afficherMines() {
  const data = minesData[mineActive];
  const container = document.getElementById("mineList");
  container.innerHTML = "";

  data.mines.forEach(mine => {
    const div = document.createElement("div");
    div.className = "mine";

    div.innerHTML = `
      <p>Puits ${mine.id}</p>
      <p>Production : ${mine.production.toFixed(2)}</p>
      <p>Gain : +${mine.gain.toFixed(2)}</p>
      <p>Coût : ${mine.nextCost}</p>

      <div class="mine-controls">
        <button class="small" onclick="downgradeMine(${mine.id})">-</button>

        <input type="number" min="1" value="${mine.level}"
               onchange="setMineLevel(${mine.id}, this.value)"
               style="width:60px; text-align:center;">

        <button class="small" onclick="upgradeMine(${mine.id})">+</button>
      </div>
    `;

    container.appendChild(div);
  });
}

function afficherTransport() {
  const data = minesData[mineActive];

  document.getElementById("elevatorLevel").innerHTML = `
    <input type="number" min="1" value="${data.elevator.level}"
           onchange="setElevatorLevel(this.value)"
           style="width:60px; text-align:center;">
  `;

  document.getElementById("warehouseLevel").innerHTML = `
    <input type="number" min="1" value="${data.warehouse.level}"
           onchange="setWarehouseLevel(this.value)"
           style="width:60px; text-align:center;">
  `;
}

function afficherRecommandation() {
  document.getElementById("recommandation").textContent =
    "👉 " + meilleureAmelioration();
}

function afficherTout() {
  afficherMenuMines();
  afficherTransport();
  afficherMines();
  afficherRecommandation();
}

// --- ACTIONS ---

function ajouterMine() {
  const data = minesData[mineActive];
  const id = data.mines.length + 1;
  data.mines.push(new Mine(id));
  sauvegarder();
  afficherTout();
}

function upgradeMine(id) {
  const mine = minesData[mineActive].mines.find(m => m.id === id);
  mine.level++;
  sauvegarder();
  afficherTout();
}

function downgradeMine(id) {
  const mine = minesData[mineActive].mines.find(m => m.id === id);
  if (mine.level > 1) mine.level--;
  sauvegarder();
  afficherTout();
}

function setMineLevel(id, value) {
  const mine = minesData[mineActive].mines.find(m => m.id === id);
  let lvl = parseInt(value);
  if (isNaN(lvl) || lvl < 1) lvl = 1;

  mine.level = lvl;
  sauvegarder();
  afficherTout();
}

function setElevatorLevel(value) {
  let lvl = parseInt(value);
  if (isNaN(lvl) || lvl < 1) lvl = 1;

  minesData[mineActive].elevator.level = lvl;
  sauvegarder();
  afficherTout();
}

function setWarehouseLevel(value) {
  let lvl = parseInt(value);
  if (isNaN(lvl) || lvl < 1) lvl = 1;

  minesData[mineActive].warehouse.level = lvl;
  sauvegarder();
  afficherTout();
}

// --- INITIALISATION ---

chargerMine(1);
chargerMine(2);
chargerMine(3);

afficherTout();
