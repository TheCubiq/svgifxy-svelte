<script lang="ts">
	import DragAreaOverlay from '$lib/components/nodes/controllers/DragAreaOverlay.svelte';
	import Pan1DArea from '$lib/components/nodes/controllers/Pan1DArea.svelte';
	import Pan2DArea from '$lib/components/nodes/controllers/Pan2DArea.svelte';
</script>

<main id="component-gallery" >
	<h3>Component Showcase</h3>

	<ul>
		<li>
			<Pan2DArea 
			mode="relative" 
			cursor="move" 
			smoothScroll={false}
			infiniteMouse={true}
			clamping={{ minX: false, maxX: false, minY: false, maxY: false }}
			let:pos>
				<div style="aspect-ratio: 1; font-size: .5em; padding: .5em;">
					<p>Position:</p>
					<p>x: {pos.x}</p>
					<p>y: {pos.y}</p>
					</div>
				<DragAreaOverlay {pos} />
			</Pan2DArea>
		</li>

		<li>
			<Pan1DArea
				value={0.5} 
				angle={0}
				mode="relative"
				let:pos>
				<div class="pan1d-area" style:--_v={pos * 100}%>
					<p>Value:</p>
					<p>{pos}</p>
				</div>
		</Pan1DArea>

		</li>

	</ul>
</main>

<style>

	main {
		width: 100%;
    height: 100%;
    display: block;
    max-width: 20rem;
    text-align: center;
    padding: 1em;
    padding-block-start: 3rem;
	}

	ul {
		list-style: none;
		display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

	}

	li {
		padding: 1em;
		margin-bottom: 1rem;

		width: 100%;
    display: grid;
		grid-template-columns: auto 10rem auto;
    /* width: 10rem; */

		background: #fff1;
    border-radius: 0.5em;
    box-shadow: 6px 7px 16px 10px #0000000f;
    backdrop-filter: var(--ftr-glass);


		
		:global(#component-gallery & > *) {
			grid-column: 2;			
		}
	}

	.pan1d-area {
		/* Add any specific styles for the Pan1DArea component here */
		background: #fff1;
		border-radius: 0.5em;
		box-shadow: 6px 7px 16px 10px #0000000f;
		backdrop-filter: var(--ftr-glass);
		padding: .5em;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: .5em;

		background: linear-gradient(
			90deg, 
			var(--clr-text-t100) var(--_v, 0%), 
			transparent 0px
		);
		border: solid 2px var(--clr-text-t100);
	}

	h3 {
		margin-bottom: 1rem;
	}
</style>
