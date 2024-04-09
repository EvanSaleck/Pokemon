Pokemon.import_pokemon();

/**
 * Fonction getPokemonsByType()
 * @param {*} typeName
 * @returns liste des pokémons ayant le type spécifié
 */
function getPokemonsByType(typeName) {
  let pokemons = [];
  // Parcours de tous les Pokémon
  for (const pokemonId in Pokemon.all_pokemons) {
    const pokemon = Pokemon.all_pokemons[pokemonId];
    // Vérification si le Pokémon possède l'attaque spécifiée
    if (pokemon.getTypes().some((type) => type.nom_type == typeName)) {
      // Ajout du Pokémon à la liste des Pokémon ayant l'attaque spécifiée
      pokemons.push(pokemon);
    }
  }
  return pokemons;
}

/**
 * Fonction getPokemonsByAttack()
 * @param {*} attackName
 * @returns liste des pokémons ayant l'attaque spécifiée
 */
function getPokemonsByAttack(attackName) {
  let pokemons = [];
  // Parcours de tous les Pokémon
  for (const pokemonId in Pokemon.all_pokemons) {
    const pokemon = Pokemon.all_pokemons[pokemonId];
    // Vérification si le Pokémon possède l'attaque spécifiée
    if (pokemon.getAttacks().some((attack) => attack.nom == attackName)) {
      // Ajout du Pokémon à la liste des Pokémon ayant l'attaque spécifiée
      pokemons.push(pokemon);
    }
  }
  return pokemons;
}

/**
 * Fonction getAttacksByType()
 * @param {*} typeName
 * @returns liste des attaques du type spécifié
 *  */
function getAttacksByType(typeName) {
  let attacks = [];
  // Parcours de toutes les attaques
  for (const attackId in Attack.all_attacks) {
    const attack = Attack.all_attacks[attackId];
    // Vérification si l'attaque a le type spécifié
    if (attack.type === typeName) {
      // Ajout de l'attaque à la liste des attaques du type spécifié
      attacks.push(attack);
    }
  }
  return attacks;
}

/**
 * Fonction sortPokemonByName()
 * @returns liste des pokémons triés par nom (ordre alphabétique)
 */
function sortPokemonByName() {
  // Extraction des valeurs de Pokemon.all_pokemons dans un tableau
  let resPokemon = Object.values(Pokemon.all_pokemons).sort(function (a, b) {
    // Si a est plus grand que b, on retourne 1
    if (a.nom > b.nom) {
      return 1;
    }
    // Si a est plus petit que b, on retourne -1
    if (a.nom < b.nom) {
      return -1;
    }
    return 0;
  });

  return resPokemon;
}

/**
 * Fonction sortPokemonByStamina()
 * @returns liste des pokémons triés par stamina (ordre décroissant)
 */
function sortPokemonByStamina() {
  // Extraction des valeurs de Pokemon.all_pokemons dans un tableau
  let pokemonsArray = Object.values(Pokemon.all_pokemons);

  // Tri du tableau par le statut de stamina du Pokémon (ordre décroissant)
  pokemonsArray.sort((a, b) => b.stamina - a.stamina);

  return pokemonsArray;
}

/**
 * Fonction getWeakestEnemies()
 * @param {*} attackName
 * @returns Liste tous les pokémons les plus efficaces contre l'attaque spécifiée
 */
function getWeakestEnemies(attackName) {
  let plusEfficace = 0;
  let PlusfaiblesEnnemis = [];

  // Recherche de l'attaque par son nom
  const attack = Object.values(Attack.all_attacks).find(
    (attack) => attack.nom === attackName
  );

  if (!attack) {
    throw new Error(`L'attaque '${attackName}' n'existe pas.`);
  }

  // Parcours de chaque Pokémon pour déterminer les attaques les moins efficaces
  for (const pokemon of Object.values(Pokemon.all_pokemons)) {
    let effi = 1;

    // Obtention des types du Pokémon
    const pokemonTypes = pokemon.listetype;

    // Calcul de l'efficacité de l'attaque sur chaque type du Pokémon
    for (const pokemonType of pokemonTypes) {
      const effiData = type_effectiveness[attack.type];
      if (effiData && effiData[pokemonType]) {
        effi *= effiData[pokemonType];
      }
    }

    if (effi > plusEfficace) {
      plusEfficace = effi;
      PlusfaiblesEnnemis = [pokemon];
    } else if (effi === plusEfficace) {
      PlusfaiblesEnnemis.push(pokemon);
    }
  }
  return PlusfaiblesEnnemis;
}

/**
 * Fonction getBestAttackTypesForEnemy()
 * @param {*} pokemonName
 * @returns Les types d'attaque les plus efficaces contre le Pokémon spécifié
 */
function getBestAttackTypesForEnemy(pokemonName) {
  const mostEffectiveTypes = {};

  // Recherche du Pokémon par son nom
  const pokemon = Object.values(Pokemon.all_pokemons).find(
    (pokemon) => pokemon.nom === pokemonName
  );

  if (!pokemon) {
    console.log(`Pokemon '${pokemonName}' not found.`);
    return mostEffectiveTypes;
  }

  // Obtention des types du Pokémon
  const pokemonTypes = pokemon.listetype;

  // Parcours des types du Pokémon pour déterminer les types d'attaque les plus efficaces
  for (const pokemonType of pokemonTypes) {
    let bestMultiplier = -Infinity;
    let bestTypes = [];

    // Parcours de chaque type d'attaque
    for (const attackType in type_effectiveness) {
      const effectivenessData = type_effectiveness[attackType];
      const multiplier = effectivenessData[pokemonType];

      if (multiplier > bestMultiplier) {
        bestMultiplier = multiplier;
        bestTypes = [attackType];
      } else if (multiplier === bestMultiplier) {
        bestTypes.push(attackType);
      }
    }

    mostEffectiveTypes[pokemonType] = bestTypes;
  }

  return mostEffectiveTypes;
}

/**
 * Fonction ExecuteCommand()
 * @param {*} CmdNom
 * @returns Nothing
 */
function ExecuteCommand(CmdNom) {
  const args = document.getElementById("args").value;
  // let res = document.getElementById("res");

  switch (CmdNom) {
    case "getPokemonsByType":
      console.table(getPokemonsByType(args));
      break;
    case "getPokemonsByAttack":
      console.table(getPokemonsByAttack(args));
      break;
    case "getAttacksByType":
      console.table(getAttacksByType(args));
      break;
    case "sortPokemonByName":
      console.table(sortPokemonByName());
      break;
    case "sortPokemonByStamina":
      console.table(sortPokemonByStamina());
      break;
    case "getWeakestEnemies":
      console.table(getWeakestEnemies(args));
      break;
    case "getBestAttackTypesForEnemy":
      console.table(getBestAttackTypesForEnemy(args));

      break;
    default:
      let res = document.getElementById("res");
      res.innerHTML = "Test non reconnu";
      console.log("Test non reconnu");
  }
}

console.log(Pokemon.all_pokemons);
