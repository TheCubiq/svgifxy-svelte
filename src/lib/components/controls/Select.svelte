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
	let hasFocus = false; // Track focus state

	function handleSelect(option: { name: string; value: any }, index: number) {
		selectedIndex = index;
		dispatch('input', option.value);
		isOpen = false;
	}

	$: console.log("hasFocus", hasFocus);

	function handleKeydown(event: KeyboardEvent) {
		if (!hasFocus) return; // Only handle if focused
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

<!-- Remove global keydown handler -->
<svelte:window
	on:click={handleClickOutside}
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
		on:click={() => isOpen = !isOpen}
		on:focus={() => hasFocus = true}
		on:blur={() => hasFocus = false}
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
		padding: 0.45em 0.6em;
		border-radius: var(--corner-rad);
		background: var(--clr-bg-t50);
		border: 1px solid var(--clr-text-t100);
		color: var(--clr-text);
		font-size: 0.75rem;
		font-family: var(--font-body);
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		align-items: center;
		transition: all 0.2s var(--ease-out-expo);
	}

	.selected-option:hover {
		border-color: var(--clr-text-t200);
		background: var(--clr-text-t50);
	}

	.arrow {
		color: var(--clr-text-t300);
		font-size: 0.7em;
		transition: transform 0.25s var(--ease-out-expo);
	}

	.arrow.open {
		transform: rotate(180deg);
	}

	.options-container {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin-top: 4px;
		background: var(--clr-bg-t900);
		border: 1px solid var(--clr-text-t100);
		border-radius: var(--corner-rad);
		max-height: 200px;
		overflow-y: auto;
		z-index: 100;
		backdrop-filter: blur(16px) saturate(1.5);
		box-shadow: 0 8px 24px -4px rgb(0 0 0 / 40%);
	}

	.option {
		padding: 0.45em 0.6em;
		cursor: pointer;
		font-size: 0.75rem;
		color: var(--clr-text);
		background: none;
		border: none;
		width: 100%;
		text-align: left;
		font-family: var(--font-body);
		transition: background 0.15s;
	}

	.option:hover {
		background: var(--clr-text-t100);
	}

	.option.selected {
		background: var(--clr-primary-t100);
		color: var(--clr-primary);
	}

	.select-wrapper:focus {
		outline: none;
	}

	.select-wrapper:focus .selected-option {
		border-color: var(--clr-primary-t400);
		box-shadow: 0 0 0 2px var(--clr-primary-t100);
	}
</style>
