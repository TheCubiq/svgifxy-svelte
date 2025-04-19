<script lang="ts">
	import { dndType } from '$lib/stores';
	import { capitalize, toCamelCase } from '$lib/utils/commonUtils';
  import { useSvelteFlow, type NodeTypes } from '@xyflow/svelte';
  import { createEventDispatcher } from 'svelte';

  export let nodeTypes: NodeTypes;
  // export let nodes = [];
  
  const dispatch = createEventDispatcher();

  const onDragStart = (event: DragEvent, nodeType: string) => {
    if (!event.dataTransfer) {
      return null;
    }
    dndType.set(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  $: availableNodes = Object.keys(nodeTypes).map((type) => {
    let label = type.replace('fe', '');
    // on each capital letter, add a space
    label = label.replace(/([A-Z])/g, ' $1').trim();
    label = capitalize(label);
    return { type, label}
  });

  const onClick = (nodeType: string) => {
    dndType.set(nodeType);
    dispatch('addNode');
  };
</script>

<aside>
  <div class="description">
    Drag & drop nodes or click to add
  </div>
  
  <div class="nodes">
    {#each availableNodes as node}
      <button
        type="button"
        class="node"
        draggable="true" 
        on:dragstart={(e) => onDragStart(e, node.type)}
        on:click={() => onClick(node.type)}
        on:keydown={(e) => e.key === 'Enter' && onClick(node.type)}
        aria-label={`Add ${node.label} node`}
      >
        {node.label}
      </button>
    {/each}
  </div>
</aside>

<style>
  aside {
    position: fixed;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: var(--clr-bg-t600);
    border-radius: var(--corner-rad);
    padding: 1.3em;
    border: 1px solid var(--clr-text-t200);
    width: 180px;
    max-height: 80vh;
    overflow-y: auto;

    backdrop-filter: var(--ftr-glass);
  }

  .description {
    font-size: 0.8em;
    color: var(--clr-text-t500);
    margin-bottom: 1rem;
    text-align: center;
  }

  .nodes {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .node {
    padding: 0.5rem;
    border: 1px solid var(--clr-text-t200);
    border-radius: var(--corner-rad);
    cursor: move;
    background: var(--clr-secondary-t800);
    transition: 0.2s ease;
    transition-property: background, transform;
  }

  .node:hover {
    background: var(--clr-secondary-t700);
    transform: translateX(2px);
  }
</style>