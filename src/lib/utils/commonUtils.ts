// Helper function to generate random position
export const getRandomPosition = (): Position => ({
	x: Math.floor(Math.random() * 1000),
	y: Math.floor(Math.random() * 1000)
});

export const rgb2hex = (c: string) => {
  return '#' + (c.match(/\d+/g)?.map((x) => (+x).toString(16).padStart(2, '0')).join('') || '')
}

export const anyToHex = (anyColor: string = '#000000') => {
	if (anyColor.startsWith('#')) return anyColor;
	// rgb(255, 0, 0) -> #ff0000
	return rgb2hex(anyColor); 
};

// Helper function to convert kebab-case to camelCase
export const toCamelCase = (str: string): string => {
	return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

// capitalize first letter
export const capitalize = (str: string): string => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

// from camelCase to kebab-case
export const toKebabCase = (str: string): string => {
	return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())
};

export type GestureEvent = MouseEvent | TouchEvent;

export const getMousePos = (e: GestureEvent) => {
	let pos = (e as TouchEvent).touches ? (e as TouchEvent).touches[0] : (e as MouseEvent);
	return { x: pos.clientX, y: pos.clientY };
};

// https://stackoverflow.com/a/17323608
// % in js is not modulo, it's remainder
export const mod = (n: number, m: number) => {
  return ((n % m) + m) % m;
};

export const lerp = (start: number, end: number, t: number) => {
	return start * (1 - t) + end * t;
}

export const roundTo = (num: number, precision: number = 5) => {
	const factor = Math.pow(10, precision);
	return Math.round(num * factor) / factor;
}