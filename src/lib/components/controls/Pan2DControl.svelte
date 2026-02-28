<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Pan2DArea from '../nodes/controllers/Pan2DArea.svelte';
  import DragAreaOverlay from '../nodes/controllers/DragAreaOverlay.svelte';
  import { lerp } from '$lib/utils/commonUtils';

  export let value = '0 0';
  export let config: any = {
    min: { x: -100, y: -100 },
    max: { x: 100, y: 100 }
  };

  const dispatch = createEventDispatcher();

  // Convert actual values to normalized 0-1 range
  $: [rawX, rawY] = value.split(' ').map(Number);
  $: x = (rawX - config.min.x) / (config.max.x - config.min.x);
  $: y = (rawY - config.min.y) / (config.max.y - config.min.y);

  function handleChange(e: CustomEvent) {
    const { x: normalizedX, y: normalizedY } = e.detail;
    
    // Convert normalized values back to actual range using lerp
    const actualX = lerp(config.min.x, config.max.x, normalizedX);
    const actualY = lerp(config.min.y, config.max.y, normalizedY);
    
    dispatch('input', `${actualX} ${actualY}`);
  }
</script>

<Pan2DArea
  {x}
  {y}
  {...config}
  on:change={handleChange}
  let:pos
>
  <div class="pan2d-area">
      <div class="values">
          <p>X: {rawX.toFixed(1)}</p>
          <p>Y: {rawY.toFixed(1)}</p>
      </div>
      <DragAreaOverlay {pos} />
  </div>
</Pan2DArea>

<style>
  .pan2d-area {
      width: 100%;
      height: 100%;
      padding: 0.5em;
      border-radius: var(--corner-rad);
      background: var(--clr-text-t50);
      font-size: 0.75rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      aspect-ratio: 1;
      min-width: 5rem;
      border: 1px solid var(--clr-text-t100);
      transition: border-color 0.2s;
  }

  .pan2d-area:hover {
      border-color: var(--clr-primary-t300);
  }

  .values {
      z-index: 1;
      background: var(--clr-bg-t600);
      padding: 0.25em 0.4em;
      border-radius: 0.25rem;
      backdrop-filter: blur(4px);
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--clr-text-t600);
  }
</style>
