<script lang="ts">
  import { convertToSvgFilter, createFilter } from "$lib/utils/nodeUtils";
  import { onMount } from "svelte";

  export let id: string;
  export let nodeData: any;
  export let resizable: boolean = false;
  export let bg: boolean = false;
  export let cssCompile : boolean = false;

  export let processingInterval: number = 50;

  let compiledFilter = '';
  let updateInterval: number;
  let lastNodeData = {};


  const recompilePreviewSVG = () => {
    const filterContent = convertToSvgFilter(id, nodeData);
    compiledFilter = createFilter(id, filterContent, cssCompile);
  }

  // force recompile on cssCompile change
  $: recompilePreviewSVG(cssCompile);

  onMount(() => {
    updateInterval = setInterval(() => {
      if (lastNodeData !== nodeData) {
        recompilePreviewSVG();
        lastNodeData = nodeData;
      }
    }, processingInterval);

    return () => {
      clearInterval(updateInterval);
    };
  });

</script>

<div 
  class="color nodrag" 
  class:resizable
  class:bg
  style:--f={cssCompile ? compiledFilter : `url(#${id})`}
>
<div class="content">
  {#if !cssCompile}
    {@html compiledFilter}
  {/if}
</div>
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
      /* display: none; */
    }

    /* &:has(:not(.content))::before {
      display: block;
    } */
	}

  .content {
    position: absolute;
    inset: 0;
  }
</style>