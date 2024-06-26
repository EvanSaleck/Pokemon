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

  // Listeners Pour la modale et l'image
  let tr = document.querySelectorAll("tbody tr");
  for (var i = 0; i < tr.length; ++i) {
    tr[i].addEventListener("click", OpenModal); // Utilisez "click" au lieu de "onclick"
    tr[i].lastElementChild.addEventListener("mouseover", HoverImage);
    tr[i].lastElementChild.addEventListener("mouseleave", StopHover); // Ajoutez l'événement mouseleave à l'élément tr
  }
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
  divimg.src = "/html/webp/images/" + id.toString().padStart(3, "0") + ".webp";
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
