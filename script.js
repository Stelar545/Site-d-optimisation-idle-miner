/*
OBJECTIF DU PROJET :
Créer un optimiseur Idle Miner Tycoon comme Bromine.

Fonctionnalités actuelles :
- Ajout de puits
- Upgrade des puits, ascenseur, dépôt
- Calcul de production
- Détection du meilleur investissement
- Sauvegarde automatique (localStorage)
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
  constructor
