<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	export let value: any;
	export let config: {
		options: Array<{ name: string; value: any }>;
	};

	const dispatch = createEventDispatcher();
	let isOpen = false;
	let selectedIndex = config.options.findIndex((opt) => opt.value === value);
	let containerRef: HTMLDivElement;

	function handleSelect(option: { name: string; value: any }, index: number) {
		selectedIndex = index;
		dispatch('input', option.value);
		isOpen = false;
	}

	function handleKeydown(event: KeyboardEvent) {
        // this is ai slop, ill fix it later
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				selectedIndex = (selectedIndex + 1) % config.options.length;
				if (!isOpen) handleSelect(config.options[selectedIndex], selectedIndex);
				break;
			case 'ArrowUp':
				event.preventDefault();
				selectedIndex = selectedIndex - 1 < 0 ? config.options.length - 1 : selectedIndex - 1;
				if (!isOpen) handleSelect(config.options[selectedIndex], selectedIndex);
				break;
			case 'Enter':
				event.preventDefault();
				if (!isOpen) {
					isOpen = true;
				} else {
					handleSelect(config.options[selectedIndex], selectedIndex);
				}
				break;
			case 'Escape':
				if (isOpen) isOpen = false;
				break;
		}
	}

	function handleClickOutside(event: MouseEvent) {
		if (containerRef && !containerRef.contains(event.target as Node)) {
			isOpen = false;
		}
	}
</script>

<svelte:window
	on:click={handleClickOutside}
	on:keydown={handleKeydown}
/>

<div
	class="select-wrapper"
	bind:this={containerRef}
	tabindex="0"
	role="combobox"
	aria-expanded={isOpen}
	aria-controls="options-list"
	aria-haspopup="listbox"
	aria-label="Select an option"
	on:keydown={handleKeydown}
>
	<button
		type="button"
		class="selected-option"
		on:click={() => (isOpen = !isOpen)}
		aria-label={config.options[selectedIndex]?.name || 'Select option'}
	>
		<span>{config.options[selectedIndex]?.name || 'Select option'}</span>
		<span class="arrow" class:open={isOpen} aria-hidden="true">▼</span>
	</button>

	{#if isOpen}
		<div
			id="options-list"
			class="options-container"
			role="listbox"
			aria-label="Options"
			transition:slide={{ duration: 200 }}
		>
			{#each config.options as option, i}
				<button
					type="button"
					class="option"
					role="option"
					aria-selected={i === selectedIndex}
					class:selected={i === selectedIndex}
					on:click={() => handleSelect(option, i)}
				>
					{option.name}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.select-wrapper {
		position: relative;
		width: 100%;
	}

	.selected-option {
		width: 100%;
		padding: 0.5em;
		border-radius: 0.3em;
		background: var(--clr-bg-t50);
		border: 2px solid var(--clr-text-t100);
		color: var(--clr-text);
		font-size: 0.8em;
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.arrow {
		color: var(--clr-text-t100);
		font-size: 0.8em;
		transition: transform 0.2s ease;
	}

	.arrow.open {
		transform: rotate(180deg);
	}

	.options-container {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin-top: 0.2em;
		background: rgba(var(--clr-bg-rgb), 0.5);
		border: 2px solid var(--clr-text-t100);
		border-radius: 0.3em;
		max-height: 200px;
		overflow-y: auto;
		z-index: 100;
		backdrop-filter: blur(12px);
	}

	.option {
		padding: 0.5em;
		cursor: pointer;
		font-size: 0.8em;
		color: var(--clr-text);
		background: none;
		border: none;
    width: 100%;
	}

	.option:hover,
	.option.selected {
		background: var(--clr-text-t100);
	}

	.select-wrapper:focus {
		outline: none;
	}

	.select-wrapper:focus .selected-option {
		border-color: var(--clr-text);
	}
</style>
