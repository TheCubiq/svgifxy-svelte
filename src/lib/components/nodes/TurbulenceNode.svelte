<script lang="ts">
	import { Handle, Position, useEdges, useNodesData, useSvelteFlow, type NodeProps } from '@xyflow/svelte';
	import Select from '../Select.svelte';
	import { findAllConnections } from '$lib/utils/nodeUtils';
	import SvgPreview from '../SvgPreview.svelte';
	import { spring, tweened } from 'svelte/motion';
	import { getMousePos, mod, type GestureEvent } from '$lib/utils/commonUtils';
	import { Mouse } from 'lucide-svelte';
	import { cubicOut } from 'svelte/easing';
	type $$Props = NodeProps;
	export let id: $$Props['id'];
	export let data: $$Props['data'];

	const {baseFrequency, numOctaves, seed, type} = data;

	const { updateNodeData } = useSvelteFlow();

	$: nodesData = useNodesData(id);

	$: console.log($nodesData);

	let dragging = false;

	let startPos = { x: 0, y: 0 };

	interface DOMRectDimensions {
		x: number;
		y: number;
		width: number;
		height: number;
	}

	let size: DOMRectDimensions = { x: 0, y: 0, width: 0, height: 0};

	$: console.log(size)

	let dragArea: HTMLDivElement;

	// todo: slip instead of spring:
	// https://codepen.io/JunreyCen/pen/arRYem

	const dotPos = spring(
		{
      x: 50,
      y: 50,
    },
    {
      stiffness: 0.02,
      damping: 0.055,
    }
  );

	const handleDrag = (evt: GestureEvent) => {
		if (!dragging) return;
		evt.preventDefault();
		// console.log(evt.clientX, evt.clientY);
		let { x, y } = getMousePos(evt);

		x = (x - startPos.x) / size.width * 100
		y = (y - startPos.y) / size.height * 100

		// x = Math.min(100, Math.max(0, x));
		// y = Math.min(100, Math.max(0, y));

		dotPos.set({x,y});
	}

	const handleMouseDown = (evt: GestureEvent) => {
		size = dragArea.getBoundingClientRect();
		const pos = getMousePos(evt);
		dragging = true;

		startPos = {
			x: pos.x - $dotPos.x * size.width / 100,
			y: pos.y - $dotPos.y * size.height / 100,
		}

	}

	const handleMouseUp = (evt: GestureEvent) => {
		dragging = false;
		// dotPos.set({ x: 50, y: 50 });
	}


	const cssPerc = (val: number) => `${val}%`;

</script>


<svelte:window 
	on:mouseup|preventDefault={handleMouseUp}
	on:mousemove|preventDefault={handleDrag}
	on:touchend|preventDefault={handleMouseUp}
	on:touchmove|preventDefault={handleDrag}
/>

<div class="node">
	<div class="content">
		<h3>Turbulence</h3>


		<Select
			onChange={(evt) => updateNodeData(id, { type: evt.currentTarget.value })}
			value={type}
			options={['fractalNoise', 'turbulence']}
		/>

		<input
			type="number"
			placeholder="baseFrequency"
			value={baseFrequency}
			step="0.01"
			on:input={(evt) => updateNodeData(id, { baseFrequency: evt.currentTarget.value })}
		/>
		<input
			type="number"
			placeholder="numOctaves"
			value={numOctaves}
			on:input={(evt) => updateNodeData(id, { numOctaves: evt.currentTarget.value })}
		/>
		<input
			type="number"
			placeholder="seed"
			value={seed}
			on:input={(evt) => updateNodeData(id, { seed: evt.currentTarget.value })}
		/>

		<div
			tabindex="-1"
			role="button"
			class="dragArea nodrag"

			bind:this={dragArea}
			on:mousedown|preventDefault={handleMouseDown}
			on:touchstart|preventDefault={handleMouseDown}
			style:--_x={cssPerc(mod($dotPos.x, 100))}
			style:--_y={cssPerc(mod($dotPos.y, 100))}
			>
			<!-- style:--_x={cssPerc($dotPos.x / size.width * 100)} -->
			<!-- style:--_y={cssPerc($dotPos.y / size.height * 100)} -->
			<div 
				class="dot"
			></div>
			<SvgPreview {id} nodeData={$nodesData} />
		</div>

	</div>
	<Handle type="source" position={Position.Bottom} />
</div>

<style>
	.dragArea {
		position: relative;
		cursor: move;
		aspect-ratio: 1;
		min-width: 5rem;

		border-radius: 0.3em;

		/* grid using linear gradient */

		background-image: linear-gradient(90deg, var(--clr-text-t300) 1px, transparent 1px),
			linear-gradient(0deg, var(--clr-text-t300) 1px, transparent 1px);

		background-size: 20px 20px;

		background-position: var(--_x, 0) var(--_y, 0);


	}
	.dot {
		width: 10px;
		height: 10px;
		border: solid var(--clr-text-t300) 1px;
		border-radius: 50%;
		position: absolute;
		left: var(--_x, 0);
		top: var(--_y, 0);
		transform: translate(-50%, -50%);
	}
</style>
