/**
 * Fonction qui lit les données et importe les données dans les classes Pokemons et les stocke dans la variable de classe all_pokemons
 */
import { pokemon_types } from 'pokemon_types.js'

function import_pokemon() {
    pokemon.forEach(pokemon => {
        try {
            if (pokemon.form === "Normal") {
                
                var Poke = new Pokemon(pokemon.pokemon_name, pokemon.form, pokemon.base_attack, pokemon.base_defense, pokemon.base_stamina);
                var type = new Type()// Il faut ajouter les types de pokémons, depuis pokemon_types.js en fonction de l'id du pokémon et de sa forme
                // Ajout du Pokémon dans la liste de tous les pokémons 
                Pokemon.all_pokemon[pokemon.pokemon_id] = Poke;
            }
        } catch (error) {
            console.error("Une erreur est survenue lors de l'importation du Pokémon :", error);
        }
    });
}
