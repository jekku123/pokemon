const cards = document.querySelector(".cards");
const searchInput = document.querySelector("#search-input");

const generations = [
  { limit: 151, offset: 0 },
  { limit: 100, offset: 151 },
  { limit: 135, offset: 251 },
  { limit: 107, offset: 386 },
  { limit: 156, offset: 493 },
  { limit: 72, offset: 649 },
  { limit: 88, offset: 721 },
  { limit: 96, offset: 809 },
  { limit: 3, offset: 905 },
];

let results = [];

const fetchData = async (generations) => {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${generations.limit}&offset=${generations.offset}`
  );
  const data = await res.json();

  const mappedFetches = data.results.map(async (pokemon) => {
    const res = await fetch(pokemon.url);
    const data = await res.json();
    return data;
  });

  results = await Promise.all(mappedFetches);

  setData(results);
};

const setData = (data) => {
  const pokemonCards = data
    .map((pokemon) => {
      return `<div class="card">
    <img src="${pokemon.sprites.front_default}" alt="" />
    <h2 class="name">${pokemon.name}</h2>
    ${pokemon.types
      .map((type) => {
        return `<p class="types">${type.type.name}</p>`;
      })
      .join("")}
  </div>`;
    })
    .join("");

  cards.innerHTML = pokemonCards;
};

const filterResults = (e) => {
  const foundPokes = results.filter((el) => {
    return el.types.some((type) => type.type.name === e.target.id);
  });
  setData(foundPokes);
};

const searchPokemon = () => {
  const search = searchInput.value;
  const foundPoke = results.filter((el) => {
    return el.name === search.toLowerCase();
  });
  setData(foundPoke);
};

const setGeneration = (e) => {
  const generation = +e.target.id;
  fetchData(generations[generation]);
};

document
  .querySelectorAll(".gen-buttons")
  .forEach((el) => el.addEventListener("click", setGeneration));

document
  .querySelectorAll(".type-buttons")
  .forEach((el) => el.addEventListener("click", filterResults));

document
  .querySelector("#search-btn")
  .addEventListener("click", searchPokemon);
