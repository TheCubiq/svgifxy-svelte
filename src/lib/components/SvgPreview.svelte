<script lang="ts">
	import { convertToSvgFilter, createFilter } from "$lib/utils/nodeUtils";

  export let id: string;
  export let nodeData: any;
  export let resizable: boolean = false;

  $: cssFilter = createFilter(id, convertToSvgFilter(id, nodeData), true)
</script>

<div 
  class="color nodrag" 
  style:--f={cssFilter}
  class:resizable
>

</div>

<style>
	.color {
		border-radius: 0.3em;
		padding: 0.15em;
		outline: solid 1px var(--clr-text-t200);
		aspect-ratio: 1;
		/* background-image: url(https://media1.tenor.com/m/BCAxaLlW-soAAAAd/smile-cat.gif); */
		background-size: cover;
    overflow: hidden;
    position: relative;
		width: 5rem;
		margin: .5em;

		&.resizable {
      resize: both;
    }

    

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      backdrop-filter: var(--f);
    }
	}
</style>