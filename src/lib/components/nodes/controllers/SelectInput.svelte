<script lang="ts">
  import { createEventDispatcher, onMount, type ComponentType } from 'svelte';
  import { slide } from 'svelte/transition';
  
  // Define interfaces for our data
  interface SelectItem {
    icon?: ComponentType;
    name: string;
    value: any;
  }
  
  interface ChangeEvent {
    value: any;
  }
  
  // Props
  export let items: SelectItem[] = []; // Array of {icon, name, value}
  export let value: any = null; // Selected value
  export let placeholder: string = "Select an option";
  export let disabled: boolean = false;
  export let name: string = "";
  export let required: boolean = false;
  export let containerClass: string = "";
  
  // Internal state
  let isOpen: boolean = false;
  let selectContainer: HTMLDivElement;
  
  const dispatch = createEventDispatcher<{
    change: ChangeEvent;
  }>();
  
  // Get the selected item based on value
  $: selectedItem = items.find(item => item.value === value);
  
  function toggleDropdown(): void {
    if (!disabled) {
      isOpen = !isOpen;
    }
  }
  
  function selectItem(item: SelectItem): void {
    value = item.value;
    dispatch('change', { value: item.value });
    isOpen = false;
  }
</script>

<div 
  class="custom-select-container {containerClass}" 
  bind:this={selectContainer}
  class:disabled
>
  <div 
    class="selected-option"
    on:click={toggleDropdown}
    tabindex={disabled ? -1 : 0}
    on:keydown={e => e.key === 'Enter' && toggleDropdown()}
    aria-expanded={isOpen}
    aria-haspopup="listbox"
    aria-controls="select-dropdown"
    role="combobox"
  >
    {#if selectedItem}
      <div class="option-content">
        {#if selectedItem.icon}
          <div class="icon">
            <svelte:component this={selectedItem.icon} />
          </div>
        {/if}
        <span>{selectedItem.name}</span>
      </div>
    {:else}
      <span class="placeholder">{placeholder}</span>
    {/if}
    
    <span class="arrow" class:open={isOpen}>▼</span>
  </div>
  
  {#if isOpen}
    <div class="dropdown" transition:slide={{ duration: 150 }} role="listbox" id="select-dropdown">
      {#each items as item, i}
        <div 
          class="option" 
          class:selected={item.value === value}
          on:click={() => selectItem(item)}
          role="option"
          aria-selected={item.value === value}
          tabindex="0"
          on:keydown={e => e.key === 'Enter' && selectItem(item)}
        >
          <div class="option-content">
            {#if item.icon}
              <div class="icon">
                <svelte:component this={item.icon} />
              </div>
            {/if}
            <span>{item.name}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
  
  <!-- Hidden native select for form submission -->
  {#if name}
    <select {name} {required} style="display: none;" bind:value>
      <option value="" disabled selected={!value}>{placeholder}</option>
      {#each items as item}
        <option value={item.value}>{item.name}</option>
      {/each}
    </select>
  {/if}
</div>

<style>
  .custom-select-container {
    position: relative;
    width: 100%;
    font-family: var(--font-body);
  }
  
  .selected-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5em 0.65em;
    border: 1px solid var(--clr-text-t100);
    background-color: var(--clr-bg-t300);
    border-radius: var(--corner-rad);
    cursor: pointer;
    user-select: none;
    transition: all 0.2s var(--ease-out-expo);
    font-size: 0.8rem;
  }

  .selected-option:hover {
    border-color: var(--clr-text-t200);
    background-color: var(--clr-text-t50);
  }
  
  .disabled .selected-option {
    background-color: #0003;
    cursor: not-allowed;
    color: var(--clr-text-t300);
  }
  
  .placeholder {
    color: var(--clr-text-t300);
  }
  
  .arrow {
    font-size: 0.7em;
    transition: transform 0.25s var(--ease-out-expo);
    color: var(--clr-text-t300);
  }
  
  .arrow.open {
    transform: rotate(180deg);
  }
  
  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-block: 4px;
    background-color: var(--clr-bg-t900);
    border: 1px solid var(--clr-text-t100);
    border-radius: var(--corner-rad);
    max-height: 240px;
    overflow-y: auto;
    z-index: 10;
    box-shadow: 0 8px 24px -4px rgb(0 0 0 / 40%);
    backdrop-filter: blur(16px) saturate(1.5);
  }
  
  .option {
    padding: 0.5em 0.65em;
    cursor: pointer;
    font-size: 0.8rem;
    transition: background 0.15s;
  }
  
  .option:hover {
    background-color: var(--clr-text-t100);
  }
  
  .option.selected {
    background-color: var(--clr-primary-t100);
    color: var(--clr-primary);
  }
  
  .option-content {
    display: flex;
    align-items: center;
    gap: 0.5em;
  }
  
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    color: var(--clr-text-t400);
  }
</style>