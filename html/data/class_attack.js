class Attack {
  // Définition de la variable de classe all_attacks
  static all_attacks = {};

  // Constructeur de la classe Attack
  constructor(nom, duree, deltae, staminaloss, critical_chance, type) {
    this.nom = nom;
    this.duree = duree;
    this.deltae = deltae;
    this.staminaloss = staminaloss;
    this.critical_chance = critical_chance;
    this.type = type;
    this.charge = !!charged_moves.find((move) => move.name === nom); // Charged move
  }

  /**
   * toString()
   * @returns Retourne une chaîne de caractères représentant l'objet Attack
   */
  toString() {
    return (
      "[Attaque : " +
      this.nom +
      "| Durée : " +
      this.duree +
      "| Delta énergie : " +
      this.deltae +
      "| Perte de stamina : " +
      this.staminaloss +
      "| Chance critique : " +
      this.critical_chance +
      "| Type : " +
      this.type +
      "]"
    );
  }
}
