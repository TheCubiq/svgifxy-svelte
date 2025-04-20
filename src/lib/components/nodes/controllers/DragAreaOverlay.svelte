<script lang="ts">
  
  export let pos = { x: 0, y: 0 }; // [0, 1]
  export let gridSize = 50; // px
</script>

<div class="dragArea"
  style="
    --_x: {pos.x * 100}%; 
    --_y: {pos.y * 100}%; 
    --_grid-size: {gridSize}px;
  "
></div>

<style>
  .dragArea {
		position: absolute;
    inset: 0;
    pointer-events: none;
		aspect-ratio: 1;
		min-width: 5rem;

		border-radius: 0.3em;

		/* grid using linear gradient */

		--_clr-grid: var(--clr-text-t100);

		background-image: 
			linear-gradient(90deg, var(--_clr-grid) 1px, transparent 1px),
			linear-gradient(0deg, var(--_clr-grid) 1px, transparent 1px);

		background-size: var(--_grid-size) var(--_grid-size);

		background-position: var(--_x, 0) var(--_y, 0);

    border: solid var(--clr-text-t100);
  }
</style>