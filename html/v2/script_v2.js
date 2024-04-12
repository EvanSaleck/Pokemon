Pokemon.import_pokemon();

let table = document.querySelector("table");
let tbody = table.lastElementChild;
tbody.innerHTML = "";

let i = 1;

for (let [Poke, val] of Object.entries(Pokemon.all_pokemons)) {
    if (i > 25) {
        console.log(i);
        break;
    }
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
  td[7].innerHTML =
    "<img src='../../webp/thumbnails/" +
    numeroimg +
    ".webp' alt='" +
    val.nom +
    "'/>";

  tbody.append(clone);
  i++;
}


