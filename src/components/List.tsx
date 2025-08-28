import { useState } from "preact/hooks";
import Details from "./Details";

const List = () => {
  const [isDetailsShown, setIsDetailsShown] = useState(true);
  const index = [1, 2, 3, 4];

  return (
    <>
      <section class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {index.map(() => (
          <div
            class="relative min-h-36 rounded-2xl bg-emerald-600 p-4 text-white md:py-6 xl:min-h-48 xl:px-6 xl:py-10"
            onClick={() => setIsDetailsShown(true)}
          >
            <p class="text-lg font-bold xl:text-xl">Pokemon</p>
            <p class="xl:mt-3">Type</p>

            <img
              alt=""
              class="absolute right-4 bottom-4 h-20 w-20 lg:h-24 lg:w-24 xl:h-32 xl:w-32"
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg"
            />
          </div>
        ))}
      </section>

      {isDetailsShown && <Details close={() => setIsDetailsShown(false)} />}
    </>
  );
};

export default List;
