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
  .floating-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5em;
    margin-bottom: 0.2em;
  }
  .pop-btn {
    background: transparent;
    border: none;
    color: var(--clr-text, #fff);
    cursor: pointer;
    border-radius: 4px;
    padding: 0.2em 0.4em;
    transition: background 0.2s;
  }
  .pop-btn:hover {
    background: var(--clr-text-t100, #333);
  }
  .floating-preview-window {
    /* see inline style above */
  }
  .content {
    position: absolute;
    inset: 0;
  }
</style>