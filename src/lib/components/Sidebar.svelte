<script lang="ts">
  import { dndType } from '$lib/stores';
  import { getNodeInfo } from './nodes/nodeRegistry';
  import { createEventDispatcher } from 'svelte';
  import { FlameIcon, EyeIcon, ImageIcon, ChevronDownIcon } from 'lucide-svelte';
  const dispatch = createEventDispatcher();

  // Get available filter scripts + utility nodes
  const filterNodes = getNodeInfo();
  const utilityNodes = [
      { id: 'preview', displayName: 'Preview', description: 'Preview filter output' },
      { id: 'sourceGraphic', displayName: 'Source', description: 'Source graphic input' } 
  ];

  // Group nodes by category
  const categories = [
    { name: 'Filters', nodes: filterNodes, open: true },
    { name: 'Utility', nodes: utilityNodes, open: true },
  ];

  let openCategories = categories.map(() => true);

  const toggleCategory = (i: number) => {
    openCategories[i] = !openCategories[i];
  };

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
  <div class="sidebar-brand">
    <FlameIcon size="1em" strokeWidth={2.5} />
    <span class="brand-text">FORGE</span>
  </div>
  
  <div class="sidebar-hint">
    Drag or click to add
  </div>

  <div class="categories">
    {#each categories as cat, ci}
      <div class="category">
        <button 
          class="category-header" 
          on:click={() => toggleCategory(ci)}
          aria-expanded={openCategories[ci]}
        >
          <span class="category-name">{cat.name}</span>
          <ChevronDownIcon 
            size="0.85em" 
            class="chevron {openCategories[ci] ? 'open' : ''}" 
          />
        </button>
        
        {#if openCategories[ci]}
          <div class="nodes stagger-children">
            {#each cat.nodes as node}
              <button
                type="button"
                class="node-btn"
                draggable="true" 
                on:dragstart={(e) => onDragStart(e, node.id)}
                on:click={() => onClick(node.id)}
                on:keydown={(e) => e.key === 'Enter' && onClick(node.id)}
                aria-label={`Add ${node.displayName} node`}
              >
                <span class="node-name">{node.displayName}</span>
                {#if node.description}
                  <span class="node-desc">{node.description}</span>
                {/if}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</aside>

<style>
aside {
  position: fixed;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: var(--clr-bg-t700);
  border-radius: 0.75rem;
  padding: 0.75rem;
  border: 1px solid var(--clr-text-t100);
  width: 11rem;
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
  backdrop-filter: var(--ftr-glass);
  z-index: 10;
  animation: slide-in-left 0.5s var(--ease-out-expo) 0.15s backwards;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Brand header */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.35rem;
  color: var(--clr-primary);
}

.brand-text {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  color: var(--clr-primary);
}

.sidebar-hint {
  font-size: 0.6rem;
  color: var(--clr-text-t300);
  padding: 0 0.35rem;
  letter-spacing: 0.02em;
}

/* Categories */
.categories {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.category {
  display: flex;
  flex-direction: column;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3rem 0.4rem;
  background: none;
  border: none;
  color: var(--clr-text-t400);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 0.3rem;
  transition: color 0.2s, background 0.2s;

  &:hover {
    color: var(--clr-text-t600);
    background: var(--clr-text-t50);
  }
}

:global(.chevron) {
  transition: transform 0.25s var(--ease-out-expo) !important;
}

:global(.chevron.open) {
  transform: rotate(180deg);
}

/* Node list */
.nodes {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-top: 0.2rem;
}

.node-btn {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 0.4rem 0.5rem;
  border: 1px solid transparent;
  border-radius: 0.4rem;
  cursor: grab;
  background: transparent;
  color: var(--clr-text);
  text-align: left;
  transition: all 0.2s var(--ease-out-expo);
  position: relative;

  &:hover {
    background: var(--clr-text-t50);
    border-color: var(--clr-text-t100);
    transform: translateX(3px);
  }

  &:active {
    background: var(--clr-primary-t100);
    border-color: var(--clr-primary-t200);
    transform: translateX(3px) scale(0.98);
    cursor: grabbing;
  }
}

.node-name {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.2;
}

.node-desc {
  font-size: 0.6rem;
  color: var(--clr-text-t300);
  line-height: 1.2;
  display: none; /* Show on hover via parent */
}

.node-btn:hover .node-desc {
  display: block;
}
</style>