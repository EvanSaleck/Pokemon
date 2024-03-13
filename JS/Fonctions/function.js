/**
 * Fonction qui lit les données et importe les données dans les classes Pokemons et les stocke dans la variable de classe all_pokemons
 */
function import_pokemon() {
<<<<<<< Updated upstream
    pokemon.forEach(poke => {
        try {
            if (poke.form === "Normal") {
                var newPokemon = new Pokemon(poke.pokemon_name, poke.form, poke.base_attack, poke.base_defense, poke.base_stamina);
                // Utilisation de Object.defineProperty pour ajouter le nouveau Pokémon à la variable de classe all_pokemon
                Object.defineProperty(Pokemon.all_pokemon, poke.pokemon_id, { value: newPokemon, writable: true, enumerable: true, configurable: true });
=======
    pokemon.forEach(pokemon => {
        try {
            if (pokemon.form === "Normal") {
                var Poke = new Pokemon(pokemon.pokemon_name, pokemon.form, pokemon.base_attack, pokemon.base_defense, pokemon.base_stamina);
                Object.defineProperty(Pokemon.all_pokemon, pokemon.pokemon_id, { value: Poke, writable: true, enumerable: true, configurable: true });
>>>>>>> Stashed changes
            }
        } catch (error) {
            console.error("Une erreur est survenue lors de l'importation du Pokémon :", error);
        }
    });
}
