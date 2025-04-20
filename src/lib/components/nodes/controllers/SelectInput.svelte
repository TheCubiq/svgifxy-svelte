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
    <div class="dropdown" transition:slide={{ duration: 150 }} role="listbox">
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
    font-family: inherit;
  }
  
  .selected-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border: 1px solid var(--clr-text-t100);
    background-color: var(--clr-bg-t300);
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
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
    font-size: 0.8em;
    transition: transform 0.2s ease;
  }
  
  .arrow.open {
    transform: rotate(180deg);
  }
  
  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-block: .15em;
    background-color: var(--clr-bg);
    border: 1px solid var(--clr-text-t100);
    /* border-top: none; */
    border-radius: 0 0 4px 4px;
    max-height: 240px;
    overflow-y: auto;
    z-index: 10;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .option {
    padding: 10px 12px;
    cursor: pointer;
  }
  
  .option:hover {
    background-color: var(--clr-text-t100);
  }
  
  .option.selected {
    background-color: #e6f7ff;
  }
  
  .option-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
  }
</style>