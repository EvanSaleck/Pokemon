class Pokemon {
    static all_pokemon = {};   // Variable de classe qui stocke tous les pokémons
    
    constructor(nom, forme, atk, dfs, pv) {
        // this.id = id;
        if (forme === "Normal") {
            this.nom = nom;
            this.forme = forme;
            this.atk = atk;
            this.dfs = dfs;
            this.pv = pv;
        } else {
            // Permet de lever une exception si la forme du Pokémon n'est pas valide 
            throw new Error("La forme du Pokémon n'est pas valide");
        }
    }
    static import_pokemon(){
        // Recupération des données depuis nos fichiers JS
        // Ajout des Pokémons
        pokemon.forEach(poke => {
            if (poke.form != "Normal"){
                return;
            } else {
                // Création d'un objet Pokemon
                let Poke = new Pokemon(poke.pokemon_name, poke.form, poke.base_attack, poke.base_defense, poke.base_stamina);
                // On l'ajoute dans la static all_Pokemons
                Pokemon.all_pokemon[poke.pokemon_id] = Poke;
            }
        });
        // Ajout des Types
        let moves = fast_moves.concat(charged_moves);
        
        // Itération sur chaque mouvement
        moves.forEach(move => {
            // Initialisation de la liste d'identifiants de Pokémon
            let idpok = [];
        
            // Recherche des identifiants de Pokémon associés à chaque mouvement
            pokemon_moves.forEach(moveid => {
                // Vérification si le mouvement est de forme "Normal"
                if (moveid.form === "Normal") {
                    // Vérification si le mouvement est trouvé dans les mouvements de Pokémon
                    if (moveid.charged_moves.includes(move.name) || moveid.elite_charged_moves.includes(move.name) || moveid.fast_moves.includes(move.name) || moveid === move.name) {
                        idpok.push(moveid.pokemon_id);
                        Pokemon.all_pokemon[pokid].setlistetype(move.type)
                    }
                }
            });      
            let Atk = new Attack(move.name, move.type, move.duration, move.energy_delta, move.stamina_loss_scaler, move.critical_chance, move.type, idpok);
            Attack.all_attacks[move.move_id ] = Atk;

            // Ajout des types
            types.forEach(type => {
                let type = new Type(type.type_name, type.efficacy);
                Type.ajouterType(type);
            });
        });
        

    }

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

    ToString() {
        return "[Nom Pokémon : " + this.nom + " | Forme : " + this.forme + " | Attaque : " + this.atk + " | Défense : " + this.dfs + " | PV : " + this.pv + "]";
    }
}