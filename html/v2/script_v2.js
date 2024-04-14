Pokemon.import_pokemon();

// Constante de nombres de Pokémons
const NBPOKE = Object.keys(Pokemon.all_pokemons).length;
const NBPARPAGE = 25;
const NBDEPAGES = Math.ceil(NBPOKE / NBPARPAGE);

// Page actuelle (par défaut à 1)
let page = sessionStorage.getItem("page") || 1;

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

      td[0].textContent = Poke;

      let numeroimg = Poke.toString().padStart(3, "0");

      td[1].textContent = val.nom;
      td[2].textContent = val.gen;
      td[3].textContent = val.listetype;
      td[4].textContent = val.stamina;
      td[5].textContent = val.atk;
      td[6].textContent = val.dfs;
      let path = "../../webp/sprites/" + numeroimg + "MS.webp";
      fetch(path)
        .then((response) => {
          if (response.status !== 200) {
            path = "../../webp/sprites/" + numeroimg + ".webp";
          }
          td[7].innerHTML = "<img src='" + path + "' alt='" + val.nom + "'/>";
        })
        .catch((error) => {
          console.error(
            "Une erreur s'est produite lors du chargement de l'image :",
            error
          );
          // En cas d'erreur, on prends le point d'interrogation
          path = "../../webp/sprites/" + numeroimg + ".webp";
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
      sessionStorage.setItem("page", page)
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
      sessionStorage.setItem("page", page)
      pageactual.innerText = page;
      btnprecedent.removeAttribute("disabled");
    }
    // Si elle devient égale NBDEPAGES alors on ne peut plus cliquer sur suivant
    if (page == NBDEPAGES) {
      btnsuivant.setAttribute("disabled", true);
    }
  });
}
