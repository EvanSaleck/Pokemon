Pokemon.import_pokemon();

// Constante de nombres de Pokémons
const NBPOKE = Object.keys(Pokemon.all_pokemons).length;
const NBPARPAGE = 25;
const NBDEPAGES = Math.ceil(NBPOKE / NBPARPAGE);

// Page actuelle (par défaut à 1)
let page = sessionStorage.getItem("page") || 1;

let ordre = {};

// Appel de la fonction GeneratePokemon qui affiche les Pokémons et appel des Listeners des boutons suivants et précédents
GeneratePokemon(page);
SetListeners();

/**
 * Permet de générer 25 Pokémons par 25 et de les ajouter au DOM
 * @param {*} page Prends en paramètre la page actuelle
 * @returns None
 */

function GeneratePokemon(page) {
  let i = 1;
  let table = document.querySelector("table");
  let tbody = table.lastElementChild;
  tbody.innerHTML = "";

  for (let [Poke, val] of Object.entries(Pokemon.all_pokemons)) {
    if (i > NBPARPAGE * (page - 1) && i <= NBPARPAGE * page) {
      let template = document.querySelector("#template-poke");
      const clone = template.content.cloneNode(true);
      let tr = clone.querySelector("tr");
      let td = clone.querySelectorAll("td");

      // Ajout d'un attribut unique a chaque pokémon
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
    i++;
  }
}

/**
 * Permet de mettre en place les écouteurs d'évènements des boutons
 * @param None
 * @returns None
 */

function SetListeners() {
  // On définit les boutons précédent et suivant
  let btnprecedent = document.getElementById("precedent");
  let btnsuivant = document.getElementById("suivant");
  let pageactual = document.getElementById("pageactual");
  let nbpage = document.getElementById("Nbpage");

  // Définition de base de la page par défaut
  pageactual.innerText = page;
  nbpage.innerText = NBDEPAGES;

  if (page <= 1) {
    btnprecedent.setAttribute("disabled", true);
  } else if (page == NBDEPAGES) {
    btnsuivant.setAttribute("disabled", true);
  }

  // Ajout des Listeners sur les boutons pour afficher les Pokémons précédents ou suivants
  btnprecedent.addEventListener("click", function () {
    // Si la page est plus grande que 1 on la décrémente au moment du clic
    if (page > 1) {
      page--;
      // On regénère les Pokémons avec la nouvelle page
      GeneratePokemon(page);
      sessionStorage.setItem("page", page);
      pageactual.innerText = page;
      btnsuivant.removeAttribute("disabled");
    }
    // Si elle devient égale ou plus petite a 1 alors on ne peut plus cliquer sur précédent
    if (page <= 1) {
      btnprecedent.setAttribute("disabled", true);
    }
  });

  btnsuivant.addEventListener("click", function () {
    // Si la page est plus petite que NBDEPAGES on l'incrémente au moment du clic
    if (page < NBDEPAGES) {
      page++;
      GeneratePokemon(page);
      sessionStorage.setItem("page", page);
      pageactual.innerText = page;
      btnprecedent.removeAttribute("disabled");
    }
    // Si elle devient égale NBDEPAGES alors on ne peut plus cliquer sur suivant
    if (page == NBDEPAGES) {
      btnsuivant.setAttribute("disabled", true);
    }
  });

  // Listeners Pour la modal
  // Listeners Pour la modal
  let tr = document.querySelectorAll("tbody tr");
  // console.log(tr);
  for (var i = 0; i < tr.length; ++i) {
    tr[i].addEventListener("click", OpenModal); // Utilisez "click" au lieu de "onclick"
    tr[i].lastElementChild.addEventListener("mouseover", HoverImage);
    tr[i].lastElementChild.addEventListener("mouseleave", StopHover); // Ajoutez l'événement mouseleave à l'élément tr
  }

  document.querySelectorAll("th:not(:last-child)").forEach((th, index) => {
    th.addEventListener("click", () => {
      TrierPokemon(index);
    });
  });
}

/**
 * Fonction qui permet d'ouvrir une modal avec les informations du Pokémon
 * @param {*} event
 * @returns None
 */
function OpenModal(event) {
  let id = event.srcElement.parentNode.getAttribute("poke-id");

  let modal = document.getElementById("modal");
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
        attack.type +
        "</p>";
      modal.querySelector("#listfast").appendChild(clone);
    } else {
      let clone = template.content.cloneNode(true);
      let atk = clone.querySelector(".accordeon");
      atk.textContent = attack.nom;
      let val = clone.querySelector(".panel");
      val.textContent =
        "<p>Durée : " +
        attack.duree +
        " Delta énergie : " +
        attack.deltae +
        " Perte de stamina : " +
        attack.staminaloss +
        " Chance critique : " +
        attack.critical_chance +
        " Type : " +
        attack.type +
        "</p>";
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
  divimg.src = "/html/webp/images/" + id + ".webp";
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
 * Fonction getPokemonsByType()
 * @param {*} typeName
 * @returns liste des pokémons ayant le type spécifié
 */
function getPokemonsByType(typeName) {
    let pokemons = [];
    // Parcours de tous les Pokémon
    for (const pokemonId in Pokemon.all_pokemons) {
      const pokemon = Pokemon.all_pokemons[pokemonId];
      // Vérification si le Pokémon possède le type spécifiée
      if (pokemon.getTypes().some((type) => type.nom_type == typeName)) {
        // Ajout du Pokémon à la liste des Pokémon ayant le type spécifié
        pokemons.push(pokemon);
      }
    }
    return pokemons;
  }

  /**
 * Fonction getPokemonsByGen()
 * @param {*} GenName
 * @returns liste des pokémons ayant la génération spécifiée
 */
  function getPokemonsByGen(GenName) {
    let pokemons = [];
    // Parcours de tous les Pokémon
    for (const pokemonId in Pokemon.all_pokemons) {
        const pokemon = Pokemon.all_pokemons[pokemonId];
        if (pokemon.gen === GenName) {
            pokemons.push(pokemon);
        }
    }
    return pokemons;
}

/**
 * Fonction qui permet de trier les Pokémons en fonction de la colonne cliquée
 * @param {*} idCol
 * @returns None
 */
function TrierPokemon(idCol) {
  const table = document.querySelector("table");
  const tbody = table.querySelector("tbody");

  const col = Array.from(tbody.querySelectorAll("tr"));

  const Fact = ordre[idCol] === "asc" ? 1 : -1;

  col.sort((LA, LB) => {
    const ValA = LA.querySelectorAll("td")[idCol].textContent.trim();
    const ValB = LB.querySelectorAll("td")[idCol].textContent.trim();

    if (ValA.localeCompare(ValB) === 0) {
      const nameA = LA.querySelectorAll("td")[1].textContent.trim();
      const nameB = LB.querySelectorAll("td")[1].textContent.trim();
      return nameA.localeCompare(nameB) * Fact;
    }
    return ValA.localeCompare(ValB) * Fact;
  });

  ordre[idCol] = ordre[idCol] === "asc" ? "desc" : "asc";

  tbody.innerHTML = "";
  col.forEach((row) => {
    tbody.appendChild(row);
  });

  const ths = document.querySelectorAll("th");
  ths.forEach((th) => {
    th.style.fontWeight = "normal";
  });
  ths[idCol].style.fontWeight = "bold";
}