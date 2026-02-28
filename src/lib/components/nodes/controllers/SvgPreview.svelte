<script lang="ts">
  import { convertToSvgFilter, createFilter } from "$lib/utils/nodeUtils";
  import { onMount } from "svelte";
  import { portal } from "$lib/utils/portal";
  import { MonitorUpIcon, MonitorDownIcon } from "lucide-svelte";
  import { onDestroy } from "svelte";
  import FloatingWindow from "$lib/components/FloatingWindow.svelte";

  export let id: string;
  export let nodeData: any;
  export let resizable: boolean = false;
  export let bg: boolean = false;
  export let cssCompile : boolean = false;
  export let floatable: boolean = false;

  export let processingInterval: number = 50;

  let compiledFilter = '';
  let updateInterval: number;
  let lastNodeData = {};
  let isFloating = false;

  function toggleFloating() {
    isFloating = !isFloating;
  }

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

<FloatingWindow
  floating={isFloating}
  portalId="floating-preview"
  title="SVG Preview"
  onToggle={toggleFloating}
  floatable={floatable}
>
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
</FloatingWindow>

<style>
	.color {
		border-radius: var(--corner-rad);
		outline: solid 1px var(--clr-text-t100);
		aspect-ratio: 1;
		background-size: cover;
    overflow: hidden;
    position: relative;
		width: 100%;
		transition: outline-color 0.2s;

    
		&.resizable {
      resize: both;
    }   
    
    &.bg {
      background-image: url(https://media1.tenor.com/m/BCAxaLlW-soAAAAd/smile-cat.gif);
    }

		&:hover {
			outline-color: var(--clr-text-t200);
		}

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      backdrop-filter: var(--f);
    }
	}
  .content {
    position: absolute;
    inset: 0;
  }
</style>