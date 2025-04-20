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
		max-width: 16rem;
		margin: auto;
		width: calc(100% - 2rem);
		background: var(--clr-bg-t600);
		backdrop-filter: var(--ftr-glass);
		color: var(--clr-text);
		cursor: default;

		border-radius: var(--corner-rad);
    padding: 1.3em;
    border: 1px solid var(--clr-text-t200);
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(4px);
	}

	hr {
		opacity: 0.2;
	}

	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}

	button {
		background-color: var(--clr-bg);
		aspect-ratio: 1;
		border-radius: 50%;
		display: flex;
		align-self: center;
		padding: 0.4em;
		color: var(--clr-text);
		border: none;

		margin-inline: auto;
		cursor: pointer;
	}

	div {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}
</style>
