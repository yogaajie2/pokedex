import { useEffect, useState } from "preact/hooks";
import Details from "./Details";
import type { Pokemon } from "../types";
import { typeColors } from "../type-colors";
import { fetchPokemonDetails, fetchPokemons } from "../api";

const List = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailsShown, setIsDetailsShown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [totalPokemon, setTotalPokemon] = useState(0);

  // temp hardcoded value
  const perPage = 131;

  const totalPages = Math.ceil(totalPokemon / perPage);

  useEffect(() => {
    // Get total pokemon count
    fetchPokemons(100000, 0).then((data) => {
      setTotalPokemon(data.count);
    });

    // Initial fetch
    fetchPokemons(perPage, 0).then(async ({ results: list }) => {
      const data: any = [];

      await Promise.all(
        list.map(async (pokemon: { name: string }) => {
          const details = await fetchPokemonDetails(pokemon.name);
          data[details.id] = details;
        }),
      );

      setPokemons(data);
      setIsLoading(false);
    });
  }, []);

  // Show pagination buttons based on total data and per page
  function renderPagination({
    onPageChange,
  }: {
    onPageChange: (page: number) => void;
  }) {
    return Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`hover:bg-gray cursor-pointer rounded-lg px-2 py-1 transition-colors hover:text-white md:px-3 md:text-lg ${
          currentPage === page ? "bg-gray text-white" : "text-black"
        }`}
      >
        {page}
      </button>
    ));
  }

  return isLoading ? (
    <div class="fixed top-0 left-0 flex h-screen w-screen flex-col items-center justify-center gap-8">
      <p class="text-2xl font-bold">Loading...</p>

      <svg
        class="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        width="80"
        height="80"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 4c4.08 0 7.45 3.05 7.94 7h-4.06c-.45-1.73-2.02-3-3.88-3s-3.43 1.27-3.87 3H4.06C4.55 7.05 7.92 4 12 4"
          opacity="0.3"
        />

        <path
          fill="currentColor"
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 2c4.08 0 7.45 3.05 7.94 7h-4.06c-.45-1.73-2.02-3-3.88-3s-3.43 1.27-3.87 3H4.06C4.55 7.05 7.92 4 12 4m2 8c0 1.1-.9 2-2 2s-2-.9-2-2s.9-2 2-2s2 .9 2 2m-2 8c-4.08 0-7.45-3.05-7.94-7h4.06c.44 1.73 2.01 3 3.87 3s3.43-1.27 3.87-3h4.06c-.47 3.95-3.84 7-7.92 7"
        />
      </svg>
    </div>
  ) : (
    <>
      <nav class="mt-6 flex items-center justify-center gap-2 md:gap-4">
        {renderPagination({
          onPageChange: (page: number) => {
            setIsLoading(true);

            fetchPokemons(perPage, (page - 1) * perPage).then(
              async ({ results: list }) => {
                const data: any = [];

                await Promise.all(
                  list.map(async (pokemon: { name: string }) => {
                    const details = await fetchPokemonDetails(pokemon.name);
                    data[details.id] = details;
                  }),
                );

                setPokemons(data);
                setIsLoading(false);
              },
            );

            setCurrentPage(page);
          },
        })}
      </nav>

      <section class="mt-6 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
        {pokemons.map((pokemon: Pokemon) => (
          <div
            class={`relative min-h-36 cursor-pointer rounded-2xl p-4 text-white transition-transform hover:scale-105 md:py-6 xl:min-h-48 xl:p-6 ${typeColors[pokemon.types[0].type.name as string] || "bg-shadow"}`}
            key={pokemon.id}
            role="button"
            onClick={() => {
              setSelectedPokemon(pokemon);
              setIsDetailsShown(true);
            }}
          >
            <p class="text-lg font-bold capitalize lg:text-xl xl:text-2xl">
              {pokemon.name.replace(/-/g, " ")}
            </p>

            <div class="mt-3 flex flex-col gap-2 xl:mt-6">
              {pokemon.types.map((type) => (
                <p class="w-16 rounded-2xl bg-white/35 px-2 py-1 text-center text-sm capitalize">
                  {type.type.name}
                </p>
              ))}
            </div>

            <img
              alt=""
              class="absolute right-2 bottom-2 h-20 w-20 lg:h-24 lg:w-24 xl:h-32 xl:w-32"
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
              onError={(e) =>
                (e.currentTarget.src =
                  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIiBzdHJva2U9IiM2ZjZmNmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIj48cGF0aCBkPSJNMjAuMDQgMTYuMDQ4QTkgOSAwIDAgMCA3Ljk1NyAzLjk1OG0tMi4zMiAxLjY3OGE5IDkgMCAxIDAgMTIuNzM3IDEyLjcxOSIvPjxwYXRoIGQ9Ik05Ljg4NCA5Ljg3NGEzIDMgMCAxIDAgNC4yNCA0LjI0Nm0uNTctMy40NDFhMyAzIDAgMCAwLTEuNDEtMS4zOU0zIDEyaDZtNyAwaDVNMyAzbDE4IDE4Ii8+PC9nPjwvc3ZnPg==")
              }
            />
          </div>
        ))}
      </section>

      {isDetailsShown && (
        <Details
          close={() => setIsDetailsShown(false)}
          pokemon={selectedPokemon}
        />
      )}
    </>
  );
};

export default List;
