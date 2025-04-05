<script lang="ts">
	import DragAreaOverlay from '$lib/components/nodes/controllers/DragAreaOverlay.svelte';
	import Pan1DArea from '$lib/components/nodes/controllers/Pan1DArea.svelte';
	import Pan2DArea from '$lib/components/nodes/controllers/Pan2DArea.svelte';
	import Slider from '$lib/components/controls/Slider.svelte';
	import Knob from '$lib/components/controls/Knob.svelte';
</script>

<main id="component-gallery">
	<h3>Component Showcase</h3>

	<ul>
		<!-- Demo 2D Drag Area -->
		<li>
			<div class="controller-wrapper pan2d">
				<Pan2DArea
					mode="relative"
					cursor="move"
					smoothScroll={false}
					infiniteMouse={true}
					clamping={{ minX: false, maxX: false, minY: false, maxY: false }}
					let:pos
				>
					<div style="aspect-ratio: 1; font-size: .5em; padding: .5em;">
						<p>Position:</p>
						<p>x: {pos.x}</p>
						<p>y: {pos.y}</p>
					</div>
					<DragAreaOverlay {pos} />
				</Pan2DArea>
			</div>
		</li>

		<!-- Demo Horizontal Slider -->
		<li>
			<div class="controller-wrapper pan1d">
				<Slider value={0.5} angle={0} />
			</div>
		</li>

		<!-- Demo Audio Knob -->
		<li>
			<div class="controller-wrapper audio-knob">
				<Knob value={0.5} />
			</div>
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
		gap: 1rem;
	}

	li {
		padding: 1em;
		width: 100%;

		display: flex;
		align-items: center;
		justify-content: center;
		

		background: #fff1;
		border-radius: 0.5em;    
		box-shadow: 6px 7px 16px 10px #0001, 0 0 0px 1px var(--clr-text-t200);
		/* backdrop-filter: var(--ftr-glass); */
	}

	.controller-wrapper {
		width: 10rem;
		box-shadow: 6px 7px 16px 10px #0000000f;
		backdrop-filter: var(--ftr-glass); 
    border-radius: 0.3em;
	}

	.audio-knob {
		width: 4rem;
		height: 4rem;
		border-radius: 50%;
	}

	h3 {
		margin-bottom: 1rem;
	}
</style>
