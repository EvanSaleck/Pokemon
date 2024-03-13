/**
 * Fonction qui lit les données et importe les données dans les classes Pokemons et les stocke dans la variable de classe all_pokemons
 */
function import_pokemon() {
    pokemon.forEach(pokemon => {
        try {
            if (pokemon.form === "Normal") {
                var Poke = new Pokemon(pokemon.pokemon_name, pokemon.form, pokemon.base_attack, pokemon.base_defense, pokemon.base_stamina);
                // Ajout du Pokémon dans la liste de tous les pokémons 
                Pokemon.all_pokemon[pokemon.pokemon_id] = Poke;
            }
        } catch (error) {
            console.error("Une erreur est survenue lors de l'importation du Pokémon :", error);
        }
    });
}
