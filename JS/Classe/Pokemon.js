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

