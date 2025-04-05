<script lang="ts">
	import Pan1DArea from '../nodes/controllers/Pan1DArea.svelte';
	export let value = 0.5;
</script>

<Pan1DArea
	{value}
	angle={-90}
	mode="relative"
	infiniteMouse={true}
	sensitivitySettings={{ default: .1, speed: [0.05, 5] }}
  scrollMultiplier={0.2}
	let:pos
>
	<div class="knob" style:--_rotation="{pos * 300 - 150}deg">
		<div class="indicator"></div>
	</div>
	<div class="knob-text">
		<p class="value-text">Value:</p>
		<p class="value-text">{pos}</p>
	</div>
</Pan1DArea>

<style>
	.knob-text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		color: var(--clr-text-t100);
		font-size: 1em;
	}

	.knob {
		height: 100%;
		aspect-ratio: 1;
		border-radius: 50%;
		background: var(--clr-text-t100);
		position: relative;
		transform: rotate(var(--_rotation));
		/* transition: transform 0.05s; */
		border: 2px solid var(--clr-text-t100);
	}

	.indicator {
		position: absolute;
		width: 0.25em;
		height: 0.8em;
		background: var(--clr-text-t100);
		left: 50%;
		transform: translateX(-50%);
		border-radius: 1em;
	}

	.value-text {
		font-size: 0.5em;
		color: var(--clr-text);
	}
</style>
