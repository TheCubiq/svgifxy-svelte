import { writable } from "svelte/store";

export const dndType = writable<string | null>(null);