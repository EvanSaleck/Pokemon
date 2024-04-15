Pokemon.import_pokemon();
// Constante de nombres de Pokémons
const NBPOKE = Object.keys(Pokemon.all_pokemons).length;
const NBPARPAGE = 25;
let NBDEPAGES = Math.ceil(NBPOKE / NBPARPAGE);

// Page actuelle (par défaut à 1)
let page = sessionStorage.getItem("page") || 1;

let ordre = {};

let currentGenFilter = "all";
let currentTypeFilter = "all";
let currentNameFilter = "";

let filteredPokemon = {};
filteredPokemon = Pokemon.all_pokemons;

// Appel de la fonction fillSelect() au chargement de la page pour remplir les listes déroulantes
document.addEventListener("DOMContentLoaded", function() {
    fillSelect();
});


// Appel de la fonction GeneratePokemon qui affiche les Pokémons et appel des Listeners des boutons suivants et précédents
GeneratePokemon(page, Pokemon.all_pokemons);
SetBtnListeners();

/**
 * Permet de générer 25 Pokémons par 25 et de les ajouter au DOM
 * @param {*} page Prends en paramètre la page actuelle
 * @returns None
 */
function GeneratePokemon(page, pokemons) {
    let i = 1;
    let table = document.querySelector("table");
    let tbody = table.lastElementChild;
    tbody.innerHTML = "";

    // Convertir les Pokémon filtrés en tableau pour faciliter la pagination
    let filteredPokemonArray = Object.entries(pokemons);

    // Calculer l'index de début et de fin en fonction de la page actuelle
    let startIndex = (page - 1) * NBPARPAGE;
    let endIndex = page * NBPARPAGE;

    // Limiter l'index de fin pour éviter les dépassements
    endIndex = Math.min(endIndex, filteredPokemonArray.length);

    // Parcourir tous les Pokémon disponibles pour afficher ceux de la page actuelle
    for (let index = startIndex; index < endIndex; index++) {
        const [Poke, val] = filteredPokemonArray[index];
        let template = document.querySelector("#template-poke");
        const clone = template.content.cloneNode(true);
        let tr = clone.querySelector("tr");
        let td = clone.querySelectorAll("td");

        // Ajout d'un attribut unique à chaque Pokémon
        tr.setAttribute("poke-id", Poke);

        td[0].textContent = Poke;

        let numeroimg = Poke.toString().padStart(3, "0");

        td[1].textContent = val.nom;
        td[2].textContent = val.gen;
        td[3].textContent = val.listetype;
        td[4].textContent = val.stamina;
        td[5].textContent = val.atk;
        td[6].textContent = val.dfs;
        let path = "/html/webp/sprites/" + numeroimg + "MS.webp";
        fetch(path)
            .then((response) => {
                if (response.status !== 200) {
                    path = "/html/webp/sprites/" + numeroimg + ".webp";
                }
                td[7].innerHTML = "<img src='" + path + "' alt='" + val.nom + "'/>";
            })
            .catch((error) => {
                console.error(
                    "Une erreur s'est produite lors du chargement de l'image :",
                    error
                );
                // En cas d'erreur, on prends le point d'interrogation
                path = "/html/webp/sprites/" + numeroimg + ".webp";
                td[7].innerHTML = "<img src='" + path + "' alt='" + val.nom + "'/>";
            });

        tbody.append(clone);
    }
    SetListeners();
}



function fillSelect(){
    let select = document.getElementById("gen");
    Object.keys(generation).forEach((gen) => {
        let option = document.createElement("option");
        option.value = gen.slice(-1);
        option.textContent = gen;
        select.appendChild(option);
    });
    let select2 = document.getElementById("type");
    Object.keys(type_effectiveness).forEach((type) => {
        let option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        select2.appendChild(option);
    });
    
}

/**
 * Permet de mettre en place les écouteurs d'évènements des boutons
 * @param None
 * @returns None
 */
function SetListeners() {
  // Listeners Pour la modal
  let tr = document.querySelectorAll("tbody tr");
  // console.log(tr);
  for (var i = 0; i < tr.length; ++i) {
    tr[i].addEventListener("click", OpenModal);
    tr[i].lastElementChild.addEventListener("mouseover", HoverImage);
    tr[i].lastElementChild.addEventListener("mouseleave", StopHover);
  }
// Listeners sur les listes déroulantes et le champ de texte pour les filtres
document.getElementById("gen").addEventListener("change", handleFilterChange);
document.getElementById("type").addEventListener("change", handleFilterChange);
document.getElementById("nom").addEventListener("input", handleFilterChange);

  // Listeners pour le tri des colonnes
  document.querySelectorAll("th:not(:last-child)").forEach((th, index) => {
    th.addEventListener("click", () => {
      TrierPokemon(index);
    });
  });
}

/**
 * Création de la modale et de l'overlay
*/
document.body.insertAdjacentHTML('beforeend', '<div class="overlay"></div>');
const overlay = document.querySelector('.overlay');
/**
 * Fonction qui permet d'ouvrir ou de fermer la modal
 * @returns None
 */
function toggleModal() {
    let modal = document.getElementById("modal");
    modal.classList.toggle('active');
    modal.classList.toggle('position');
    overlay.classList.toggle('active');
}
/**
 * Fonction qui permet de fermer la modal
 * @returns None
 */
function closeModal() {
    let modal = document.getElementById("modal");
    modal.classList.remove('active');
    modal.classList.remove('position');
    modal.querySelector("#listfast").innerHTML = "";
    modal.querySelector("#listcharged").innerHTML = "";
    overlay.classList.remove('active');
}

overlay.addEventListener('click', closeModal);

document.getElementById("close").addEventListener("click", closeModal);
/**
 * Fonction qui permet d'ouvrir une modal avec les informations du Pokémon
 * @param {*} event
 * @returns None
 */
function OpenModal(event) {
  toggleModal();

  let id = event.srcElement.parentNode.getAttribute("poke-id");

  let modal = document.getElementById("modal");
  modal.querySelector("#listfast").innerHTML = "";
  modal.querySelector("#listcharged").innerHTML = "";
  modal.querySelector("#titre").innerText = Pokemon.all_pokemons[id].getNom();
  modal.querySelector("#imgpoke").src =
    "/html/webp/thumbnails/" + id.toString().padStart(3, "0") + ".webp";
  let Attacks = Pokemon.all_pokemons[id].getAttacks();
  let template = document.querySelector("#template-accordeon");
  Attacks.forEach((attack) => {
    if (attack.charge == false) {
      let clone = template.content.cloneNode(true);
      let atk = clone.querySelector(".accordeon");
      atk.textContent = attack.nom;
      let val = clone.querySelector(".panel");
      val.innerHTML =
        "<p>Durée : " +
        attack.duree +
        " Delta énergie : " +
        attack.deltae +
        " Perte de stamina : " +
        attack.staminaloss +
        " Chance critique : " +
        attack.critical_chance +
        " Type : " +
        attack.type;
      modal.querySelector("#listfast").appendChild(clone);
    } else {
      let clone = template.content.cloneNode(true);
      let atk = clone.querySelector(".accordeon");
      atk.textContent = attack.nom;
      let val = clone.querySelector(".panel");
      val.textContent =
        "Durée : " +
        attack.duree +
        " Delta énergie : " +
        attack.deltae +
        " Perte de stamina : " +
        attack.staminaloss +
        " Chance critique : " +
        attack.critical_chance +
        " Type : " +
        attack.type;
      modal.querySelector("#listcharged").appendChild(clone);
    }
  });
  modal.classList.remove("d-none");
  let close = document.getElementById("close");
  close.addEventListener("click", function () {
    modal.classList.add("d-none");
    modal.querySelector("#listfast").innerHTML = "";
    modal.querySelector("#listcharged").innerHTML = "";
  });

  var acc = document.getElementsByClassName("accordeon");
  var i;

  for (i = 0; i < acc.length; i++) {
    console.log(acc);
    acc[i].addEventListener("click", function () {
      console.log("click");
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }
}


/**
 * Fonction qui permet d'afficher l'image du Pokémon au survol de la souris
 * @param {*} event
 * @returns None
 */
function HoverImage(event) {
    let id =
      event.srcElement.parentNode.getAttribute("poke-id") ||
      event.srcElement.parentNode.parentNode.getAttribute("poke-id");
    let divimg = document.getElementById("divimg");
    divimg.src = "../../webp/images/" + id.toString().padStart(3, "0")  + ".webp";
    divimg.classList.remove("d-none");
  }

  /**
   * Fonction qui permet de cacher l'image du Pokémon au survol de la souris
   * @param {*} event
   * @returns None
   */
  function StopHover(event) {
    let id =
      event.srcElement.parentNode.getAttribute("poke-id") ||
      event.srcElement.parentNode.parentNode.getAttribute("poke-id");
    divimg.classList.add("d-none");
  }
  

/**
 * Fonction qui permet de définir les écouteurs d'évènements sur les boutons précédent et suivant
 * @returns None
 */
function SetBtnListeners(){
    // Définissez les boutons précédent et suivant
    let btnprecedent = document.getElementById("precedent");
    let btnsuivant = document.getElementById("suivant");
    let pageactual = document.getElementById("pageactual");
    let nbpage = document.getElementById("Nbpage");
  
    // Définition de la page par défaut
    pageactual.innerText = page;
    nbpage.innerText = NBDEPAGES;
  
    if (page <= 1) {
      btnprecedent.setAttribute("disabled", true);
    } else if (page == NBDEPAGES) {
      btnsuivant.setAttribute("disabled", true);
    }
  
    // Ajout des écouteurs sur les boutons pour afficher les Pokémons précédents ou suivants
    btnprecedent.addEventListener("click", function () {
      if (page > 1) {
        page--;
        // Regénérez les Pokémons avec la nouvelle page
        GeneratePokemon(page, filteredPokemon);
        SetListeners();
        sessionStorage.setItem("page", page);
        pageactual.innerText = page;
        btnsuivant.removeAttribute("disabled");
      }
      if (page <= 1) {
        btnprecedent.setAttribute("disabled", true);
      }
    });
  
    btnsuivant.addEventListener("click", function () {

      if (page < NBDEPAGES) {
        page++;
        GeneratePokemon(page, filteredPokemon);
        SetListeners();
        sessionStorage.setItem("page", page);
        pageactual.innerText = page;
        btnprecedent.removeAttribute("disabled");
      }
      if (page == NBDEPAGES) {
        btnsuivant.setAttribute("disabled", true);
      }
    });
}

/**
 * Fonction qui permet de trier les Pokémon en fonction des filtres
 * @param {*} index
 * @returns None
 */
function handleFilterChange() {
    // Récupérer les valeurs sélectionnées dans les listes déroulantes
    let genFilter = document.getElementById("gen").value;
    let typeFilter = document.getElementById("type").value;
    let nameFilter = document.getElementById("nom").value;

    // Filtrer les Pokémon en fonction des critères sélectionnés
    filteredPokemon = filterPokemon(genFilter, typeFilter, nameFilter);

    // Vérifier si tous les filtres sont à zéro
    if (genFilter === "all" && typeFilter === "all" && nameFilter === "") {
        page = 1; // Réinitialiser la page à 1
        sessionStorage.setItem("page", page);
        pageactual.innerText = page;
        window.location.reload();
    }

    // Mettre à jour la pagination et afficher les Pokémon filtrés sur la première page
    // Régénérer la liste des Pokémon en fonction des nouveaux critères de filtrage
    GeneratePokemon(page, filteredPokemon);
    SetListeners();

    UpdatePage(filteredPokemon);
}


/**
 * Fonction qui permet de filtrer les Pokémon en fonction des critères sélectionnés
 * @param {*} genFilter 
 * @param {*} typeFilter 
 * @param {*} nameFilter 
 * @returns  filtered
 */
function filterPokemon(genFilter, typeFilter, nameFilter) {
    let filtered = {}; // Initialiser un objet vide pour les Pokémon filtrés
    
    // Parcourir tous les Pokémon et appliquer les filtres
    for (const pokemonId in Pokemon.all_pokemons) {
        const pokemon = Pokemon.all_pokemons[pokemonId];
        
        // Appliquer les filtres
        if ((genFilter === "all" || pokemon.gen === parseInt(genFilter)) &&
            (typeFilter === "all" || pokemon.getTypes().some((type) => type.nom_type === typeFilter)) &&
            (nameFilter === "" || pokemon.nom.toLowerCase().includes(nameFilter.toLowerCase()))) {
            filtered[pokemonId] = pokemon; // Ajouter le Pokémon filtré à l'objet filtré
        }
    }
    
    return filtered; // Retourner les Pokémon filtrés
}

/**
 * Fonction qui permet de trier les Pokémon en fonction de l'index de la colonne
 * @returns None
 */
function destroyTable() {
    let table = document.querySelector("table");
    let tbody = table.lastElementChild;
    tbody.innerHTML = "";
}

/**
 * Permets de mettre a jour le nombre de pages
 * @param {*} poke 
 * @returns None
 */
function UpdatePage(poke) {
    let nbpage = document.getElementById("Nbpage");
    NBDEPAGES = Math.ceil(Object.keys(poke).length / NBPARPAGE);
    nbpage.textContent = NBDEPAGES;
}