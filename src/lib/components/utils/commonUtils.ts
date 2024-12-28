
// Helper function to generate random position
export const getRandomPosition = (): Position => ({
  x: Math.floor(Math.random() * 400),
  y: Math.floor(Math.random() * 400)
});

// Helper function to convert kebab-case to camelCase
export const toCamelCase = (str: string): string => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};
