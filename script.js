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

// Ton code commence ici ↓↓↓

function calculerProduction(level) {
  return Math.pow(level, 1.6);
}

// --- Données du jeu ---
// (On mettra les vraies formules plus tard)

function productionMine(level) {
  return Math.pow(level, 1.6); // provisoire
}

function coutUpgrade(level) {
  return Math.floor(10 * Math.pow(1.15, level)); // provisoire
}

// --- Objets du jeu ---

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
    return this.level * 10; // provisoire
  }

  get nextCost() {
    return coutUpgrade(this.level);
  }
}

// --- État du jeu ---

let mines = [];
let elevator = new Transport(1);
let warehouse = new Transport(1);

// --- Fonctions utilitaires ---

function ajouterMine() {
  const id = mines.length + 1;
  mines.push(new Mine(id));
}

function resetMines() {
  mines = [];
}
