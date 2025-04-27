<script lang="ts">
  import { dndType } from '$lib/stores';
  import { getNodeInfo } from './nodes/nodeRegistry';
  import { createEventDispatcher } from 'svelte';
  import type { NodeTypes } from '@xyflow/svelte';

  export let nodeTypes: NodeTypes;
  const dispatch = createEventDispatcher();

  // Get available filter scripts + preview node
  const availableNodes = [
      ...getNodeInfo(),
      { id: 'preview', displayName: 'Preview', description: 'Preview filter output' },
      { id: 'sourceGraphic', displayName: "Source" } 
  ];

  const onDragStart = (event: DragEvent, nodeType: string) => {
      if (!event.dataTransfer) return null;
      dndType.set(nodeType);
      event.dataTransfer.effectAllowed = 'move';
  };

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
      on:dragstart={(e) => onDragStart(e, node.id)}
      on:click={() => onClick(node.id)}
      on:keydown={(e) => e.key === 'Enter' && onClick(node.id)}
      aria-label={`Add ${node.displayName} node`}
    >
      {node.displayName}
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