<script lang="ts">
  import { portal } from "$lib/utils/portal";
  import { MonitorUpIcon, MonitorDownIcon } from "lucide-svelte";
	import { Spring } from "svelte/motion";
	import { fade } from "svelte/transition";
  export let floating: boolean = false;
  export let portalId: string = "floating-preview";
  export let title: string = "Floating Window";
  export let floatable: boolean = false;
  export let onToggle: () => void = () => {};

  // let pos = { x: 0, y: 0 };
  let dragging = false;
  let offset = { x: 0, y: 0 };


  let pos = new Spring({ x: 50, y: 50 }, {
		stiffness: 0.1,
		damping: 0.25
	});


  function onDragStart(e: MouseEvent) {
    dragging = true;
    offset = {
      x: e.clientX - pos.target.x,
      y: e.clientY - pos.target.y
    };
  }
  function onDragMove(e: MouseEvent) {
    if (!dragging) return;
    // pos.x = e.clientX - offset.x;
    // pos.y = e.clientY - offset.y;
    pos.target = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    };
  }
  function onDragEnd() {
    dragging = false;
  }
</script>

<svelte:window on:mousemove={onDragMove} on:mouseup={onDragEnd} />

{#if floating}
  <div
    transition:fade
    use:portal={portalId}
    class="floating-window"
    style="left: {pos.current.x}px; top: {pos.current.y}px;"
    on:mousedown|self|preventDefault={onDragStart}
    role="dialog"
    tabindex="-1"
  >
    <div class="floating-header">
      <!-- <span>{title}</span> -->
      <button class="pop-btn" on:click={onToggle} title="Return to node">
        <MonitorDownIcon size="1.2em"/>
      </button>
    </div>
    <div class="floating-content" >
      <slot />
    </div>
  </div>
{:else if floatable}
  <div class="floating-header">
    <button class="pop-btn" on:click={onToggle} title="Pop out preview">
      <MonitorUpIcon size="1.2em"/>
    </button>
  </div>
  <div class="floating-content" transition:fade>
    <slot />
  </div>

{:else}
  <div class="floating-content">
    <slot />
  </div>
{/if}

<style>
  .floating-window {
    position: fixed;
    background: var(--clr-bg-t800);
    border-radius: 0.75rem;
    box-shadow: 
      0 0 0 1px var(--clr-text-t100),
      0 8px 32px -8px rgb(0 0 0 / 50%);
    padding: 0.75em;
    z-index: 9999;
    left: 2rem;
    top: 2rem;
    min-width: 5rem;
    min-height: 5rem;
    user-select: none;
    transition: box-shadow 0.25s var(--ease-out-expo);
    cursor: grab;
    backdrop-filter: var(--ftr-glass);
    border: 1px solid var(--clr-text-t100);
  }

  .floating-window:active {
    cursor: grabbing;
    box-shadow:
      0 0 0 1px var(--clr-primary-t200),
      0 12px 40px -8px rgb(0 0 0 / 60%),
      0 0 20px var(--clr-primary-t100);
  }

  .floating-header {
    user-select: none;
    position: absolute;
    z-index: 99;
    padding: 0.3em;
    filter: drop-shadow(1px 2px 4px rgb(0 0 0 / 60%));
    right: 0;
  }
  .pop-btn {
    background: transparent;
    border: none;
    color: var(--clr-text);
    cursor: pointer;
    border-radius: 0.3rem;
    padding: 0.2em 0.4em;
    transition: all 0.2s var(--ease-out-expo);
    opacity: 0.3;
  }
  .pop-btn:hover {
    background: var(--clr-text-t100);
    opacity: 1;
    color: var(--clr-primary);
  }
  .floating-content {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
