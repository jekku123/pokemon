const cards = document.querySelector(".cards");
const searchInput = document.querySelector("#search-input");

let pokemons = [];
let activePokemons = [];

let choises = {
  generation: "",
  types: [],
};

const getGeneration = (idx) => {
  if (idx >= 0 && idx < 151) return 1;
  if (idx >= 151 && idx < 251) return 2;
  if (idx >= 251 && idx < 386) return 3;
  if (idx >= 386 && idx < 493) return 4;
  if (idx >= 493 && idx < 649) return 5;
  if (idx >= 649 && idx < 721) return 6;
  if (idx >= 721 && idx < 809) return 7;
  if (idx >= 809 && idx < 905) return 8;
  if (idx >= 905 && idx < 908) return 9;
};

const fetchData = async () => {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=908&offset=0`
  );
  const data = await res.json();

  const mappedFetches = data.results.map(async (pokemon) => {
    const res = await fetch(pokemon.url);
    const data = await res.json();
    return data;
  });

  const mappedData = await Promise.all(mappedFetches);

  pokemons = mappedData.map((pokemon, i) => {
    return {
      id: pokemon.id,
      generation: getGeneration(i),
      name: pokemon.name,
      image: pokemon.sprites.front_default,
      types: pokemon.types.map((type) => {
        return {
          name: type.type.name,
          img: `icons/${type.type.name}.png`,
        };
      }),
    };
  });

  updatePokemons();
};

fetchData();

const setData = (data) => {
  const pokemonCards =
    data.length === 0
      ? `
      <p class="not-found-msg">No pokemon found ☹️</p>`
      : data
          .map((pokemon) => {
            return `
        <div class="card">
          <p class="generation">${pokemon.generation}</p>
          <img class="pokemon-img" src="${pokemon.image}" alt="${
              pokemon.name
            }" />
          <h2 class="name">${pokemon.name}</h2>
        <div class="types">
    ${pokemon.types
      .map((type) => {
        return `
        <div class="type">
          <img class="type-img" src="${type.img}" alt="${type.name}" />
          <p>${type.name}</p>
        </div>`;
      })
      .join("")}
    </div>
  </div>`;
          })
          .join("");

  cards.innerHTML = pokemonCards;
};

const searchPokemon = (e) => {
  const search = e.target.value;
  const foundPokemon = activePokemons.filter((el) => {
    return el.name.includes(search);
  });
  setData(foundPokemon);
};

const updatePokemons = () => {
  let foundPokemons = [];

  if (+choises.generation === 0 && choises.types.length === 0) {
    foundPokemons = pokemons;
  } else if (
    +choises.generation === 0 &&
    choises.types.length === 1
  ) {
    foundPokemons = pokemons.filter((pokemon) => {
      return pokemon.types.some((type) =>
        choises.types.includes(type.name)
      );
    });
  } else if (
    +choises.generation === 0 &&
    choises.types.length === 2
  ) {
    foundPokemons = pokemons.filter((pokemon) => {
      return pokemon.types.every((type) =>
        choises.types.includes(type.name)
      );
    });
  } else if (
    +choises.generation !== 0 &&
    choises.types.length === 0
  ) {
    foundPokemons = pokemons.filter((pokemon) => {
      return pokemon.generation === +choises.generation;
    });
  } else if (
    +choises.generation !== 0 &&
    choises.types.length === 1
  ) {
    foundPokemons = pokemons.filter((pokemon) => {
      return pokemon.types.some(
        (type) =>
          choises.types.includes(type.name) &&
          pokemon.generation === +choises.generation
      );
    });
  } else if (
    +choises.generation !== 0 &&
    choises.types.length === 2
  ) {
    foundPokemons = pokemons.filter((pokemon) => {
      return pokemon.types.every(
        (type) =>
          choises.types.includes(type.name) &&
          pokemon.generation === +choises.generation
      );
    });
  }

  activePokemons = foundPokemons;
  setData(foundPokemons);
};

const handleChoises = (e) => {
  const { name, value, type, checked } = e.target;
  if (type === "checkbox") {
    checked
      ? choises[name].push(value)
      : (choises[name] = choises[name].filter(
          (item) => item !== value
        ));
  } else {
    choises[name] = value;
  }
  updatePokemons();
};

document
  .querySelector("form")
  .addEventListener("change", handleChoises);

searchInput.addEventListener("input", searchPokemon);
