export interface Pokemon {
  abilities: { ability: { name: string } }[];
  height: number;
  id: number;
  moves: { move: { name: string } }[];
  name: string;
  stats: { base_stat: number; stat: { name: string } }[];
  types: { type: { name: string } }[];
  weight: number;
}
