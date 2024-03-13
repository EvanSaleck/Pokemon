class Type {
    // Variables de classe pour stocker les types
    static all_types = {};


    constructor(nom, efficacite) {
        this.nom = nom;
        this.efficacite = efficacite;
    }

    toString() {
        return "[Nom Attaque: " + this.nom + "Efficacité: " + this.efficacite + "]";
    }

    static addType(type) {
        this.all_types[type.nom] = type;
    }
}

// Example:
const type = new Type("Fire", [{"Bug": 1.6},
{"Dark": 1.0},
{"Dragon": 0.625},
{"Electric": 1.0},
{"Fairy": 1.0},
{"Fighting": 1.0},
{"Fire": 0.625},
{"Flying": 1.0},
{"Ghost": 1.0},
{"Grass": 1.6},
{"Ground": 1.0},
{"Ice": 1.6},
{"Normal": 1.0},
{"Poison": 1.0},
{"Psychic": 1.0},
{"Rock": 0.625},
{"Steel": 1.6},
{"Water": 0.625}]);
console.log(type.toString()); // Output: Fire
