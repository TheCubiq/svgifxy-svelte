import { writable } from "svelte/store";

export const dndType = writable<string | null>(null);
export const modalOpen = writable<boolean>(false);