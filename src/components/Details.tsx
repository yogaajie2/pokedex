import { useState } from "preact/hooks";

const Card = ({ close }: any) => {
  const [activeTab, setActiveTab] = useState("About");
  const tabs = ["About", "Base Stats", "Evolution", "Moves"];

  return (
    <div class="fixed top-0 left-0 z-10 flex h-screen w-screen items-center justify-center bg-black/50">
      <div class="relative h-full w-full bg-emerald-600 px-6 pt-20 text-white md:h-[80vh] md:w-[70vw] md:rounded-4xl md:p-12 lg:h-[80vh] lg:w-[60vw] xl:h-[75vh] xl:w-[45vw]">
        <p
          class="absolute top-8 right-6 cursor-pointer text-3xl md:top-6 md:right-12"
          onClick={close}
        >
          x
        </p>

        <section class="mt-6 flex items-center justify-between text-white">
          <div>
            <p class="text-3xl font-bold">Pokemon</p>
            <p class="mt-2 font-bold">Type</p>
          </div>

          <p class="font-bold">#001</p>
        </section>

        <section class="relative -mx-6 mt-60 h-[50vh] rounded-t-4xl bg-white p-6 pt-12 text-neutral-900 md:-mx-12 md:mt-40 md:h-[-webkit-fill-available] md:rounded-4xl md:p-12 xl:mt-48">
          <img
            alt=""
            class="absolute -top-40 left-1/2 h-48 w-48 -translate-x-1/2 lg:-top-48 lg:h-56 lg:w-56 xl:-top-48 xl:h-56 xl:w-56"
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg"
          />

          <nav>
            <ul class="flex justify-between text-center text-sm font-bold text-neutral-900">
              {tabs.map((tab) => (
                <li
                  class={`cursor-pointer border-b-3 pb-4 ${activeTab === tab ? "border-emerald-600 text-neutral-900" : "border-transparent text-neutral-400"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </nav>

          <section class="mt-6">
            {activeTab === "About" && (
              <>
                <div class="flex flex-col gap-2">
                  <div class="flex items-center">
                    <p class="w-1/3 text-neutral-400">Type</p>
                    <p class="w-2/3">Grass, Poison</p>
                  </div>

                  <div class="flex items-center">
                    <p class="w-1/3 text-neutral-400">Height</p>
                    <p class="w-2/3">70 cm</p>
                  </div>

                  <div class="flex items-center">
                    <p class="w-1/3 text-neutral-400">Weight</p>
                    <p class="w-2/3">6.9 kg</p>
                  </div>

                  <div class="flex items-center">
                    <p class="w-1/3 text-neutral-400">Abilities</p>
                    <p class="w-2/3">Overgrow, Chlorophyll</p>
                  </div>
                </div>

                <p class="mt-6 text-lg font-bold">Breeding</p>

                <div class="mt-4 flex flex-col gap-2">
                  <div class="flex items-center">
                    <p class="w-1/3 text-neutral-400">Gender</p>
                    <p class="w-2/3">deez/nuts</p>
                  </div>

                  <div class="flex items-center">
                    <p class="w-1/3 text-neutral-400">Egg Groups</p>
                    <p class="w-2/3">Monster</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Base Stats" && (
              <>
                <div class="flex flex-col gap-2">
                  <div class="flex items-center">
                    <p class="w-[25%] text-neutral-400">HP</p>
                    <p class="w-[20%] text-center">45</p>
                    <div class="h-1 w-[55%] bg-neutral-400" />
                  </div>

                  <div class="flex items-center">
                    <p class="w-[25%] text-neutral-400">Attack</p>
                    <p class="w-[20%] text-center">60</p>
                    <div class="h-1 w-[55%] bg-neutral-400" />
                  </div>

                  <div class="flex items-center">
                    <p class="w-[25%] text-neutral-400">Defense</p>
                    <p class="w-[20%] text-center">48</p>
                    <div class="h-1 w-[55%] bg-neutral-400" />
                  </div>

                  <div class="flex items-center">
                    <p class="w-[25%] text-neutral-400">Sp. Atk</p>
                    <p class="w-[20%] text-center">65</p>
                    <div class="h-1 w-[55%] bg-neutral-400" />
                  </div>

                  <div class="flex items-center">
                    <p class="w-[25%] text-neutral-400">Sp. Def</p>
                    <p class="w-[20%] text-center">65</p>
                    <div class="h-1 w-[55%] bg-neutral-400" />
                  </div>

                  <div class="flex items-center">
                    <p class="w-[25%] text-neutral-400">Speed</p>
                    <p class="w-[20%] text-center">45</p>
                    <div class="h-1 w-[55%] bg-neutral-400" />
                  </div>

                  <div class="flex items-center">
                    <p class="w-[25%] text-neutral-400">Total</p>
                    <p class="w-[20%] text-center">317</p>
                    <div class="h-1 w-[55%] bg-neutral-400" />
                  </div>
                </div>
              </>
            )}

            {activeTab === "Evolution" && (
              <>
                <p class="text-lg font-bold">Evolution Chains</p>

                <div class="mt-8 flex flex-col gap-4 text-center">
                  <p class="font-bold">Bulbasaur</p>
                  <p>down</p>
                  <p class="font-bold">Ivysaur</p>
                  <p>down</p>
                  <p class="font-bold">Venusaur</p>
                </div>
              </>
            )}

            {activeTab === "Moves" && (
              <>
                <p class="text-lg font-bold">Move List</p>

                <div class="mt-4 grid grid-cols-3 gap-2 text-center">
                  <p>Pound</p>
                  <p>Cut</p>
                  <p>Whiplash</p>
                  <p>Bop It</p>
                  <p>Twist It</p>
                  <p>Press It</p>
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
