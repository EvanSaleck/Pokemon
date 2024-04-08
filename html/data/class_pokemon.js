class Pokemon {
  // Variable de classe qui stocke tous les pokémons
  static all_pokemons = {};

  // Constructeur de la classe Pokemon
  constructor(nom, forme, gen, atk, dfs, stamina) {
    this.nom = nom;
    this.forme = forme;
    this.gen = gen;
    this.atk = atk;
    this.dfs = dfs;
    this.stamina = stamina;
    this.listeattack = new Array();
    this.listetype = new Array();
  }

  /**
   *  Getters & Setters
   */

  getNom() {
    return this.nom;
  }

  getForme() {
    return this.forme;
  }

  getAtk() {
    return this.atk;
  }

  getDfs() {
    return this.dfs;
  }

  getPv() {
    return this.pv;
  }

  setNom(nom) {
    this.nom = nom;
  }

  setForme(forme) {
    this.forme = forme;
  }

  setAtk(atk) {
    this.atk = atk;
  }

  setDfs(dfs) {
    this.dfs = dfs;
  }

  setPv(pv) {
    this.pv = pv;
  }

  /**
   * setlisteattack()
   * @param {*} attack
   * Setter pour ajouter une attaque à la liste des attaques du pokémon
   */
  setlisteattack(attack) {
    if (this.listeattack.includes(attack)) {
      console.info(
        "Attention : Le pokémon possède déjà cette attaque " + attack + "!"
      );
      return;
    } else {
      this.listeattack.push(attack);
    }
  }

  /**
   * setlistetype()
   * @param {*} type
   * Setter pour ajouter un type à la liste des types du pokémon
   */
  setlistetype(type) {
    if (this.listetype.includes(type)) {
      console.info("Attention : Le pokémon possède déjà le type " + type + "!");
      return;
    } else if (this.listetype.length >= 2) {
      console.info("Attention : Le pokémon possède déjà 2 types.");
    } else {
      this.listetype.push(type);
    }
  }

  /**
   * Fonction GetAttacks()
   * Retourne un tableau contenant toutes les attaques du pokémon
   * @return {Array} tabAtk
   */
  getAttacks() {
    const tabAtk = this.listeattack.map((attack) => Attack.all_attacks[attack]);
    return tabAtk;
  }

  /**
   * Fonction GetTypes()
   * Retourne un tableau contenant tout les types du pokémon
   * @return {Array} tabType
   */
  getTypes() {
    const tabType = this.listetype.map((type) => Type.all_types[type]);
    return tabType;
  }

  /**
   * Fonction toString()
   * @returns Retourne une chaîne de caractères représentant l'objet Pokémon
   */
  toString() {
    return (
      "[Pokémon : " +
      this.nom +
      " | Forme : " +
      this.forme +
      "Génération : " +
      this.gen +
      " | Attaque : " +
      this.atk +
      " | Défense : " +
      this.dfs +
      " | PV : " +
      this.pv +
      "]"
    );
  }

  /**
   * Fonction import_pokemon()
   * Importe les données des Pokémons depuis les fichiers JS
   * Ajoute les Pokémons, les types et les attaques
   */
  static import_pokemon() {
    // Recupération des données depuis nos fichiers JS
    // Ajout des Pokémons
    pokemon
      .filter((poke) => poke.form === "Normal")
      .forEach((poke) => {
        // Création d'un objet Pokemon
        let pokegen;
        for(let genKey in generation){
          let genData = generation[genKey];
          for(let gen in genData){
            if(genData[gen].name === poke.pokemon_name && genData[gen].id === poke.pokemon_id){
              pokegen = genData[gen].generation_number;
            }
          }
        }

        let Poke = new Pokemon(
          poke.pokemon_name,
          poke.form,
          pokegen,
          poke.base_attack,
          poke.base_defense,
          poke.base_stamina
        );
        // On l'ajoute dans la static all_Pokemons
        Pokemon.all_pokemons[poke.pokemon_id] = Poke;
      });

    // Ajout des Types

    // Merge des tableaux sur les attaques
    let moves = fast_moves.concat(charged_moves);

    // Itération sur chaque mouvement
    moves.forEach((move) => {
      // Vérification si l'attaque est déjà dans la liste des attaques
      if (
        Object.values(Attack.all_attacks).some(
          (attack) => attack.nom === move.name
        )
      ) {
        console.log("L'attaque existe déjà :", move.name);
        return; // Si oui, on passe à l'itération suivante
      } else {
        // Filtrage des mouvements Pokémon ayant la forme "Normal"
        pokemon_moves
          .filter((moveid) => moveid.form === "Normal")
          .forEach((moveid) => {
            // Vérification si le mouvement est trouvé dans les mouvements de Pokémon
            if (
              moveid.charged_moves.includes(move.name) ||
              moveid.elite_charged_moves.includes(move.name) ||
              moveid.fast_moves.includes(move.name) ||
              moveid.move_name === move.name
            ) {
              Pokemon.all_pokemons[moveid.pokemon_id].setlisteattack(
                move.move_id
              );
            }
          });
      }

      // Création de l'objet Attack et ajout à la liste des attaques
      let Atk = new Attack(
        move.name,
        move.duration,
        move.energy_delta,
        move.stamina_loss_scaler,
        move.critical_chance,
        move.type
      );
      Attack.all_attacks[move.move_id] = Atk;
    });

    // Ajout des types
    for (let typeName in type_effectiveness) {
      let efficacy = type_effectiveness[typeName];
      let type = new Type(typeName, efficacy);

      if (typeName in Type.all_types) {
        console.info("Type déjà existant : " + typeName);
      } else {
        Type.all_types[typeName] = type;
        // Filtrage des mouvements Pokémon ayant la forme "Normal"
        pokemon_types
          .filter((typeid) => typeid.form === "Normal")
          .forEach((typeid) => {
            // Vérification si le mouvement est trouvé dans les mouvements de Pokémon
            if (typeid.type.includes(typeName)) {
              Pokemon.all_pokemons[typeid.pokemon_id].setlistetype(
                type.nom_type
              );
            }
          });
        console.info("Type ajouté: " + type.nom_type);
      }
    }
  }
}
