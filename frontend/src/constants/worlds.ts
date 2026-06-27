export const WORLD_NAMES = [
  "Basics",
  "Flags",
  "World 3",
  "World 4",
  "World 5",
  "World 6",
  "World 7",
  "World 8",
  "World 9",
  "World 10"
];

export const getWorldName = (index: number): string => {
  if (index >= 0 && index < WORLD_NAMES.length) {
    return WORLD_NAMES[index];
  }
  return `World ${index + 1}`;
};
