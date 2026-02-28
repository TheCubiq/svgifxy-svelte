<script lang="ts">
	import { X } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	export let showModal = false;
	export let clickOutClose = true;
	export let customClass = '';
	let dialog: HTMLDialogElement;

	const handleEsc = (e: KeyboardEvent) => {
		if (e.key === 'Escape' && !clickOutClose) e.preventDefault();
	};

	$: if (dialog && showModal) dialog.showModal();
	$: if (!showModal && dialog) dialog.close();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
{#if showModal}
	<dialog
		class={customClass}
		bind:this={dialog}
		on:close={() => (showModal = false)}
		on:click|self={() => {
			if (clickOutClose) dialog.close();
		}}
		on:cancel|preventDefault={() => {}}
		on:keydown={handleEsc}
		out:fly|global
	>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div on:click|stopPropagation>
			<slot name="header" />
			<hr />
			<slot />
			<hr />
			<slot name="footer">
				<div class="close-wrapper">
					<button on:click={() => dialog.close()} aria-label="Close modal">
						<X />
					</button>
				</div>
			</slot>
		</div>
	</dialog>
{/if}

<style>
	dialog {
		max-width: 18rem;
		margin: auto;
		width: calc(100% - 2rem);
		background: var(--clr-bg-t800);
		backdrop-filter: var(--ftr-glass);
		color: var(--clr-text);
		cursor: default;
		border-radius: 0.75rem;
		padding: 1.2em;
		border: 1px solid var(--clr-text-t100);
		box-shadow: 0 16px 48px -8px rgb(0 0 0 / 50%);
		position: relative;
		overflow: visible;
	}

	/* Top accent line */
	dialog::after {
		content: '';
		position: absolute;
		top: 0;
		left: 1.5em;
		right: 1.5em;
		height: 2px;
		background: linear-gradient(90deg, transparent, var(--clr-primary-t500) 30%, var(--clr-primary-t500) 70%, transparent);
		border-radius: 1px;
		pointer-events: none;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(6px) saturate(0.8);
	}

	hr {
		border: none;
		height: 1px;
		background: var(--clr-text-t100);
	}

	dialog > div {
		padding: 0.75em;
	}

	dialog[open] {
		animation: scale-in 0.35s var(--ease-spring, cubic-bezier(0.34, 1.56, 0.64, 1));
	}

	dialog[open]::backdrop {
		animation: fade-in 0.25s ease-out;
	}

	button {
		display: block;
	}

	button {
		background-color: var(--clr-text-t100);
		aspect-ratio: 1;
		border-radius: 50%;
		display: flex;
		align-self: center;
		padding: 0.4em;
		color: var(--clr-text);
		border: none;
		margin-inline: auto;
		cursor: pointer;
		transition: all 0.2s var(--ease-out-expo);
	}

	button:hover {
		background-color: rgb(from var(--clr-danger) r g b / 15%);
		color: var(--clr-danger);
	}

	div {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}
</style>
