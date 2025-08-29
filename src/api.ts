const API_URL = "https://pokeapi.co/api/v2/";
const cache: { [key: string]: any } = {};

// Get function handler and caching
async function get(endpoint: string) {
  if (!cache[endpoint]) {
    const data = await fetch(API_URL + endpoint).then((response) =>
      response.json(),
    );

    cache[endpoint] = data;
  }

  return cache[endpoint];
}

export function fetchPokemons(limit: number, offset: number) {
  return get(`pokemon?limit=${limit}&offset=${offset}`);
}

export function fetchPokemonDetails(name: string) {
  return get(`pokemon/${name}`);
}

export function fetchPokemonSpecies(name: string) {
  return get(`pokemon-species/${name}`);
}
