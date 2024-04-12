class Type {
  // Définition de la variable de classe all_types
  static all_types = {};

  // Constructeur de la classe Type
  constructor(nom_type, efficacite) {
    this.nom_type = nom_type;
    this.efficacite = efficacite;
  }

  /* toString()
   * @returns Retourne une chaîne de caractères représentant l'objet Attack
   */
  toString() {
    return (
      "[Type: " +
      this.nom_type +
      " Efficacité: " +
      JSON.stringify(this.efficacite) +
      "]"
    );
  }
}
