Pokemon.import_pokemon();


let table = document.querySelector("table");
let tbody = table.lastElementChild;
tbody.innerHTML = "";

for (let [Poke, val] of Object.entries(Pokemon.all_pokemons)) {
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