<script lang="ts">
	import { convertToSvgFilter, createFilter } from "$lib/utils/nodeUtils";

  export let id: string;
  export let nodeData: any;
  export let resizable: boolean = false;
  export let bg: boolean = false;

  $: cssFilter = createFilter(id, convertToSvgFilter(id, nodeData), true)
</script>

<div 
  class="color nodrag" 
  style:--f={cssFilter}
  class:resizable
  class:bg
>

</div>

<style>
	.color {
		border-radius: 0.3em;
		outline: solid 1px var(--clr-text-t200);
		aspect-ratio: 1;
		background-size: cover;
    overflow: hidden;
    position: relative;
		width: 100%;

    
		&.resizable {
      resize: both;
    }   
    
    &.bg {
      background-image: url(https://media1.tenor.com/m/BCAxaLlW-soAAAAd/smile-cat.gif);
    }

    

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      backdrop-filter: var(--f);
    }
	}
</style>