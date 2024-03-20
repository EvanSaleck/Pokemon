class Type {
    constructor(nom_type, efficacite) {
        this.nom_type = nom_type;
        this.efficacite = efficacite;
    }

    toString() {
        return this.nom_type;
    }
    multiplicateurAttaque(typeDef) {
        for (let i = 0; i < this.efficacite.length; i++) {
            if (typeDef in this.efficacite[i]) {
                return this.efficacite[i][typeDef];
            }
        }
        return "Type non trouvé";
    }
    
    static all_types = {};

    static ajouterType(type) {
        if (type in Type.all_types) {
            throw new Error("Type déjà existant");
            
        } else {
            Type.all_types[type.nom_type] = type;
            console.log("Type ajouté: " + type.nom_type);
        } 
    }

    static listerNomTypes() {
        console.log("Liste des types: " + Object.keys(Type.all_types));
        return Object.keys(Type.all_types);
    }
}

/*
// Example:
const typeFeu = new Type("Fire", [
    {"Bug": 1.6},
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
    {"Water": 0.625}
]);

const typeTenebres = new Type("Dark", [
    {"Bug": 1.0},
    {"Dark": 0.625},
    {"Dragon": 1.0},
    {"Electric": 1.0},
    {"Fairy": 0.625},
    {"Fighting": 0.625},
    {"Fire": 1.0},
    {"Flying": 1.0},
    {"Ghost": 1.6},
    {"Grass": 1.0},
    {"Ground": 1.0},
    {"Ice": 1.0},
    {"Normal": 1.0},
    {"Poison": 1.0},
    {"Psychic": 1.6},
    {"Rock": 1.0},
    {"Steel": 1.0},
    {"Water": 1.0}
]);

Type.addType(typeTenebres);
Type.addType(typeFeu);

console.log(typeFeu.toString()); // Output: Fire
*/
