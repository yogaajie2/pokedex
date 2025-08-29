import { useEffect, useState } from "preact/hooks";
import { fetchEvolutionChains, fetchPokemonSpecies } from "../api";
import type { Pokemon } from "../types";
import { typeColors } from "../type-colors";

interface Props {
  close: () => void;
  pokemon: Pokemon | null;
}

interface Species {
  egg_groups: { name: string }[];
  evolution_chain: { url: string };
  gender_rate: number;
}

type EvolutionChain = { species: { name: string }; evolves_to: any[] };

const Card = ({ close, pokemon }: Props) => {
  const [activeTab, setActiveTab] = useState("About");

  const [evolutionChains, setEvolutionChains] = useState<{
    chain: EvolutionChain;
  } | null>(null);

  const [isEvolutionChainsLoading, setIsEvolutionChainsLoading] =
    useState(true);

  const [isSpeciesDataLoading, setIsSpeciesDataLoading] = useState(true);
  const [speciesData, setSpeciesData] = useState<Species | null>(null);
  const tabs = ["About", "Base Stats", "Evolution", "Moves"];

  useEffect(() => {
    fetchPokemonSpecies(pokemon?.name as string).then((data) => {
      setSpeciesData(data);
      setIsSpeciesDataLoading(false);
    });
  }, []);

  // Format the gender rate number which shows the number in eights into percentages
  function formatGenderRate(gender_rate: number) {
    if (gender_rate === -1) {
      return "Genderless";
    }

    const female = (gender_rate / 8) * 100;
    const male = 100 - female;

    // Round to 1 decimal
    const format = (n: number) => (n % 1 === 0 ? n : n.toFixed(1));

    return (
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2">
          <span class="text-[#00e1ff]">♂</span>
          <p>{format(male)}%</p>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-[#ff0080]">♀</span>
          <p>{format(female)}%</p>
        </div>
      </div>
    );
  }

  function renderEvolutionChain(chain: EvolutionChain) {
    let names: string[] = [];

    function traverse(node: EvolutionChain) {
      names.push(node.species.name);

      if (node.evolves_to.length > 0) {
        node.evolves_to.forEach((evolution) => traverse(evolution));
      }
    }

    traverse(chain);

    return names.map((name, index) => (
      <>
        <p
          class={`capitalize ${name === pokemon?.name ? "text-xl font-bold" : "text-lg"}`}
        >
          {name}
        </p>

        {index < names.length - 1 && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m12.37 15.835l6.43-6.63C19.201 8.79 18.958 8 18.43 8H5.57c-.528 0-.771.79-.37 1.205l6.43 6.63c.213.22.527.22.74 0"
            />
          </svg>
        )}
      </>
    ));
  }

  function totalStats() {
    return pokemon?.stats.reduce((total, stat) => total + stat.base_stat, 0);
  }

  return (
    <div class="fixed top-0 left-0 z-10 flex h-screen w-screen items-center justify-center bg-black/50">
      <div
        class={`relative h-full w-full px-6 pt-20 text-white md:h-[80vh] md:w-[70vw] md:rounded-4xl md:p-12 lg:h-[80vh] lg:w-[60vw] xl:h-[75vh] xl:w-[45vw] ${typeColors[pokemon?.types[0].type.name as string] || "bg-shadow"}`}
      >
        <button
          class="absolute top-8 right-6 cursor-pointer text-3xl md:top-6 md:right-6"
          onClick={close}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
            />
          </svg>
        </button>

        <section class="mt-6 flex items-center justify-between text-white">
          <div>
            <p class="text-4xl font-bold capitalize">{pokemon?.name}</p>

            <div class="mt-3 flex gap-2 xl:mt-6">
              {pokemon?.types.map((type) => (
                <p class="w-16 rounded-2xl bg-white/35 px-2 py-1 text-center text-sm capitalize">
                  {type.type.name}
                </p>
              ))}
            </div>
          </div>

          <p class="text-2xl font-bold text-white/75">
            #{pokemon?.id?.toString().padStart(4, "0")}
          </p>
        </section>

        <section class="relative -mx-6 mt-60 h-[55vh] rounded-t-4xl bg-white p-6 pt-12 text-black md:-mx-12 md:mt-40 md:h-[-webkit-fill-available] md:rounded-4xl md:p-12 xl:mt-48">
          <img
            alt=""
            class="absolute -top-40 left-1/2 h-48 w-48 -translate-x-1/2 lg:-top-48 lg:h-56 lg:w-56 xl:-top-48 xl:h-56 xl:w-56"
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`}
          />

          <nav>
            <ul class="flex justify-between text-center text-sm font-bold text-black">
              {tabs.map((tab) => (
                <li
                  class={`cursor-pointer border-b-3 pb-4 transition-colors hover:text-black ${activeTab === tab ? "border-black text-black" : "text-gray border-transparent"}`}
                  onClick={() => {
                    if (tab === "Evolution" && !evolutionChains) {
                      fetchEvolutionChains(
                        // Extract the ID from the URL
                        Number(
                          speciesData?.evolution_chain.url
                            .split("/")
                            .filter(Boolean) // remove empty strings
                            .pop(),
                        ),
                      ).then((data) => {
                        setEvolutionChains(data);
                        setIsEvolutionChainsLoading(false);
                      });
                    }

                    setActiveTab(tab);
                  }}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </nav>

          <section class="mt-6 h-[inherit] overflow-y-auto">
            {activeTab === "About" && (
              <>
                <div class="flex flex-col gap-2">
                  <div class="flex items-center">
                    <p class="text-gray w-1/3">Type</p>

                    <p class="w-2/3">
                      {pokemon?.types
                        .map(
                          (type) =>
                            type.type.name.charAt(0).toUpperCase() +
                            type.type.name.slice(1),
                        )
                        .join(", ")}
                    </p>
                  </div>

                  <div class="flex items-center">
                    <p class="text-gray w-1/3">Height</p>

                    <p class="w-2/3">
                      {pokemon?.height != null ? pokemon.height * 10 : "-"} cm
                    </p>
                  </div>

                  <div class="flex items-center">
                    <p class="text-gray w-1/3">Weight</p>

                    <p class="w-2/3">
                      {pokemon?.weight != null ? pokemon.weight / 10 : "-"} kg
                    </p>
                  </div>

                  <div class="flex items-center">
                    <p class="text-gray w-1/3">Abilities</p>

                    <p class="w-2/3 capitalize">
                      {pokemon?.abilities
                        .map(
                          (ability) =>
                            ability.ability.name.charAt(0).toUpperCase() +
                            ability.ability.name.slice(1).replace("-", " "),
                        )
                        .join(", ")}
                    </p>
                  </div>
                </div>

                <p class="mt-6 text-lg font-bold">Breeding</p>

                <div class="mt-4 flex flex-col gap-2">
                  <div class="flex items-center">
                    <p class="text-gray w-1/3">Gender</p>

                    <p class="w-2/3">
                      {isSpeciesDataLoading
                        ? "Loading..."
                        : formatGenderRate(speciesData?.gender_rate as number)}
                    </p>
                  </div>

                  <div class="flex items-center">
                    <p class="text-gray w-1/3">Egg Groups</p>

                    <p class="w-2/3">
                      {isSpeciesDataLoading
                        ? "Loading..."
                        : speciesData?.egg_groups
                            .map(
                              (egg_group) =>
                                egg_group.name.charAt(0).toUpperCase() +
                                egg_group.name.slice(1),
                            )
                            .join(", ")}
                    </p>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Base Stats" && (
              <>
                <div class="flex flex-col gap-2">
                  <div class="flex items-center">
                    <p class="text-gray w-[25%]">HP</p>

                    <p class="w-[20%] text-center">
                      {pokemon?.stats[0].base_stat}
                    </p>

                    <div class="bg-gray relative h-1 w-[55%] rounded">
                      <div
                        class={`relative h-1 rounded ${(pokemon?.stats[0].base_stat as number) > 66 ? "bg-grass" : (pokemon?.stats[0].base_stat as number) > 33 ? "bg-electric" : "bg-fire"}`}
                        style={{
                          width: `${(pokemon?.stats[0].base_stat as number) > 100 ? 100 : pokemon?.stats[0].base_stat}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div class="flex items-center">
                    <p class="text-gray w-[25%]">Attack</p>

                    <p class="w-[20%] text-center">
                      {pokemon?.stats[1].base_stat}
                    </p>

                    <div class="bg-gray relative h-1 w-[55%] rounded">
                      <div
                        class={`relative h-1 rounded ${(pokemon?.stats[1].base_stat as number) > 66 ? "bg-grass" : (pokemon?.stats[1].base_stat as number) > 33 ? "bg-electric" : "bg-fire"}`}
                        style={{
                          width: `${(pokemon?.stats[1].base_stat as number) > 100 ? 100 : pokemon?.stats[1].base_stat}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div class="flex items-center">
                    <p class="text-gray w-[25%]">Defense</p>

                    <p class="w-[20%] text-center">
                      {pokemon?.stats[2].base_stat}
                    </p>

                    <div class="bg-gray relative h-1 w-[55%] rounded">
                      <div
                        class={`relative h-1 rounded ${(pokemon?.stats[2].base_stat as number) > 66 ? "bg-grass" : (pokemon?.stats[2].base_stat as number) > 33 ? "bg-electric" : "bg-fire"}`}
                        style={{
                          width: `${(pokemon?.stats[2].base_stat as number) > 100 ? 100 : pokemon?.stats[2].base_stat}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div class="flex items-center">
                    <p class="text-gray w-[25%]">Sp. Atk</p>

                    <p class="w-[20%] text-center">
                      {pokemon?.stats[3].base_stat}
                    </p>

                    <div class="bg-gray relative h-1 w-[55%] rounded">
                      <div
                        class={`relative h-1 rounded ${(pokemon?.stats[3].base_stat as number) > 66 ? "bg-grass" : (pokemon?.stats[3].base_stat as number) > 33 ? "bg-electric" : "bg-fire"}`}
                        style={{
                          width: `${(pokemon?.stats[3].base_stat as number) > 100 ? 100 : pokemon?.stats[3].base_stat}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div class="flex items-center">
                    <p class="text-gray w-[25%]">Sp. Def</p>

                    <p class="w-[20%] text-center">
                      {pokemon?.stats[4].base_stat}
                    </p>

                    <div class="bg-gray relative h-1 w-[55%] rounded">
                      <div
                        class={`relative h-1 rounded ${(pokemon?.stats[4].base_stat as number) > 66 ? "bg-grass" : (pokemon?.stats[4].base_stat as number) > 33 ? "bg-electric" : "bg-fire"}`}
                        style={{
                          width: `${(pokemon?.stats[4].base_stat as number) > 100 ? 100 : pokemon?.stats[4].base_stat}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div class="flex items-center">
                    <p class="text-gray w-[25%]">Speed</p>

                    <p class="w-[20%] text-center">
                      {pokemon?.stats[5].base_stat}
                    </p>

                    <div class="bg-gray relative h-1 w-[55%] rounded">
                      <div
                        class={`relative h-1 rounded ${(pokemon?.stats[5].base_stat as number) > 66 ? "bg-grass" : (pokemon?.stats[5].base_stat as number) > 33 ? "bg-electric" : "bg-fire"}`}
                        style={{
                          width: `${(pokemon?.stats[5].base_stat as number) > 100 ? 100 : pokemon?.stats[5].base_stat}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div class="flex items-center">
                    <p class="text-gray w-[25%]">Total</p>
                    <p class="w-[20%] text-center">{totalStats()}</p>

                    <div class="bg-gray relative h-1 w-[55%] rounded">
                      <div
                        class={`relative h-1 rounded ${(totalStats() as number) > 400 ? "bg-grass" : (totalStats() as number) > 200 ? "bg-electric" : "bg-fire"}`}
                        style={{
                          width: `${Math.min(
                            100,
                            ((totalStats() ?? 0) / 600) * 100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Evolution" &&
              (isEvolutionChainsLoading ? (
                <div class="flex h-full w-full flex-col items-center gap-8 pt-12">
                  <p class="text-lg font-bold">Loading...</p>

                  <svg
                    class="animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
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
                <div class="mt-8 flex flex-col items-center gap-2">
                  {renderEvolutionChain(
                    evolutionChains?.chain as EvolutionChain,
                  )}
                </div>
              ))}

            {activeTab === "Moves" && (
              <>
                <p class="text-lg font-bold">Move List</p>

                <div class="mt-4 grid grid-cols-3 items-center gap-x-2 gap-y-4 text-center capitalize">
                  {pokemon?.moves.map((move) => (
                    <p>{move.move.name.replace("-", " ")}</p>
                  ))}
                </div>
              </>
            )}
          </section>
        </section>
      </div>
    </div>
  );
};

export default Card;
