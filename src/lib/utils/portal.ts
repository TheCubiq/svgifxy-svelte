// https://svelte.dev/playground/8364bc976f0c4ff9b83adf6e7a3c19fd

import { tick } from "svelte";

const portal_map = new Map<string, HTMLElement>();

export function createPortal(node: HTMLElement, id: string = "default"): { destroy: () => boolean } {
    const key = `$$portal.${id}`;
    if (portal_map.has(key)) throw `duplicate portal key "${id}"`;
    else portal_map.set(key, node);
    return { destroy: portal_map.delete.bind(portal_map, key) };
}

function mount(node: HTMLElement, key: string): () => boolean {
    if (!portal_map.has(key)) throw `unknown portal ${key}`;
    const host = portal_map.get(key)!;
    host.insertBefore(node, null);
    return () => host.contains(node) && host.removeChild(node) !== null;
}

export function portal(node: HTMLElement, id: string = "default"): { destroy: () => void } {
    let destroy: (() => boolean) | undefined;
    const key = `$$portal.${id}`;
    if (!portal_map.has(key))
        tick().then(() => {
            destroy = mount(node, key);
        });
    else destroy = mount(node, key);
    return { destroy: () => destroy?.() };
}
