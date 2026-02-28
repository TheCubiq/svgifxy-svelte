<script lang="ts">
    import { portal } from '$lib/utils/portal';
  import { XIcon, Maximize2Icon, Minimize2Icon } from 'lucide-svelte';
  import { onMount } from 'svelte';
    import { backInOut, bounceInOut, cubicIn, elasticIn, quartInOut, quintIn, quintOut } from 'svelte/easing';
    import { fly } from 'svelte/transition';
  
  export let show = false;
  export let title = 'Sidebar';
  
  let isFullscreen = false;
  
  function toggleFullscreen() {
    isFullscreen = !isFullscreen;
  }

  const handleClose = () => {
    show = isFullscreen = false;
  }
</script>

{#if show}
  <article 
  transition:fly={{ x: 100, duration: 500, easing: backInOut }}
  use:portal={'right-sidebar'}
  class="right-sidebar nodrag nopan nozoom"
  class:fullscreen={isFullscreen}>
    <div class="sidebar-header">
      <h2>{title}</h2>
      <div class="sidebar-controls">
        <button class="control-btn" on:click={toggleFullscreen} title={isFullscreen ? 'Minimize' : 'Maximize'}>
            <Maximize2Icon size="1.2em" class={["lucide-max", isFullscreen? 'state-on':''].join(' ')} />
        </button>
        <button class="close-btn" on:click={handleClose} title="Close">
          <XIcon size="1.2em" />
        </button>
      </div>
    </div>
    
    <div class="sidebar-content">
      <slot></slot>
    </div>

    <div class="overlay">
      <slot name="overlay"></slot>
    </div>
  </article>
{/if}

<style>
  :root {
    --func-overshoot: linear(0, -0.008 8.1%, -0.056 24.7%, -0.049 29.4%, -0.022 33.4%, 0.051 38.3%, 0.17 42.8%, 0.333 46.9%, 0.766 55.4%, 0.898 59.5%, 0.988 63.9%, 1.039 68.6%, 1.057 74.1%, 1.05 79.1%, 1.007 92.2%, 1);
    --sidebar-width: min(100%, 40rem);
    --sidebar-transition: all 0.5s var(--func-overshoot);
  }
  
  .right-sidebar {
    position: fixed;
    --_inset: 0.75rem;
    inset: var(--_inset);
    inset-inline-start: unset;
    width: var(--sidebar-width);
    background-color: var(--clr-bg-t700);
    backdrop-filter: var(--ftr-glass);
    border: 1px solid var(--clr-text-t100);
    border-radius: 0.75rem;
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    transition: var(--sidebar-transition);
  }

  /* Top accent line */
  .right-sidebar::before {
    content: '';
    position: absolute;
    top: 0;
    left: 1rem;
    right: 1rem;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--clr-primary-t500) 30%, var(--clr-primary-t500) 70%, transparent);
    border-radius: 1px;
    pointer-events: none;
    z-index: 1;
  }
  
  .fullscreen {
    --_inset: 0rem;
    width: 100%;
    border-radius: 0;
  }
  
  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.65rem 0.85rem;
    border-bottom: 1px solid var(--clr-text-t100);
  }

  .sidebar-header h2 {
    font-family: var(--font-display);
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  
  .sidebar-controls {
    display: flex;
    gap: 0.25rem;
  }
  
  .close-btn,
  .control-btn {
    background: transparent;
    border: none;
    color: var(--clr-text-t500);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.35em;
    border-radius: 0.35rem;
    transition: all 0.2s var(--ease-out-expo);
  }
  
  .close-btn:hover,
  .control-btn:hover {
    background-color: var(--clr-text-t100);
    color: var(--clr-text);
  }

  .close-btn:hover {
    background-color: rgb(from var(--clr-danger) r g b / 15%);
    color: var(--clr-danger);
  }
  
  .sidebar-content {
    padding: 0.85rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    gap: 0.75em;
  }

  .overlay {
    padding: 0.75em;
    position: absolute;
    bottom: 0;
    inset-inline: 0;
    display: flex;
    justify-content: flex-end;
    pointer-events: none;
  }
</style>