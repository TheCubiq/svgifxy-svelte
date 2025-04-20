<script lang="ts">
	import { Handle, Position, useEdges, useNodesData, useSvelteFlow, type NodeProps, type Node} from '@xyflow/svelte';
	import Select from './controllers/Select.svelte';
	import { findAllConnections } from '$lib/utils/nodeUtils';
	import SvgPreview from './controllers/SvgPreview.svelte';
	import { spring, tweened } from 'svelte/motion';
	import { getMousePos, lerp, mod, roundTo, type GestureEvent } from '$lib/utils/commonUtils';
	import { Mouse } from 'lucide-svelte';
	import { cubicOut } from 'svelte/easing';
	import { onDestroy, onMount } from 'svelte';
	import { writable } from 'svelte/store';

	type TurbulenceNode = Node<{
		baseFrequency: string;
		numOctaves: number;
		seed: number;
		type: string;
	}>
	type $$Props = NodeProps<TurbulenceNode>;
	export let id: $$Props['id'];
	export let data: $$Props['data'];

	// const {baseFrequency, numOctaves, seed, type} = data;

	const { updateNodeData } = useSvelteFlow();

	$: nodesData = useNodesData(id);

	// $: console.log($nodesData);

	let isDragging = false;

	let startPos = { x: 0, y: 0 };

	
	
	interface DOMRectDimensions {
		x: number;
		y: number;
		width: number;
		height: number;
	}
	
	let size: DOMRectDimensions = { x: 0, y: 0, width: 0, height: 0};
	
	// $: console.log(size)
	
	let dragArea: HTMLDivElement;
	
	const dotPos = writable({ x: 50, y: 50 });
	let velocity = { x: 0, y: 0 };
	let lastCoords = { x: 0, y: 0 };
	let animationFrame: number = 0;
	
	const handleDrag = (evt: GestureEvent) => {
		if (!isDragging) return;
		evt.preventDefault();
		let { x, y } = getMousePos(evt);

		x = (x - startPos.x) / size.width * 100
		y = (y - startPos.y) / size.height * 100

		x = Math.min(100, x);
		y = Math.min(100, y);

		let delta = {
      x: x - lastCoords.x,
      y: y - lastCoords.y
    };

		delta = {
			x: Math.abs(delta.x) < .5 ? 0 : delta.x,
			y: Math.abs(delta.y) < .5 ? 0 : delta.y
		}
    
    velocity = delta;

		lastCoords = { x, y };

		dotPos.set(lastCoords);
	}

	const handleMouseDown = (evt: GestureEvent) => {
		$dotPos = {
			x: (
				lerp(100, 0, 
				spaceSeparated(data.baseFrequency) * 100
			)	
			),
			y: (
				lerp(100, 0, 
				spaceSeparated(data.baseFrequency,1) * 100
			)
			)
		}
		size = dragArea.getBoundingClientRect();
		const pos = getMousePos(evt);
		isDragging = true;

		startPos = {
			x: pos.x - $dotPos.x * size.width / 100,
			y: pos.y - $dotPos.y * size.height / 100,
		}

		lastCoords = startPos;

		cancelAnimationFrame(animationFrame);

	}

	const handleMouseUp = (evt: GestureEvent) => {
		isDragging = false;
		applyMomentum();
	}


	const cssPerc = (val: number) => `${
		roundTo(
			lerp(100, 0, val * 100)
		)
		// mod(val, 100)
	}%`;


	const applyMomentum = () => {
    const friction = 0.90;
    
    function animate() {
      if (Math.abs(velocity.x) > 0.05 || Math.abs(velocity.y) > 0.05) {
        velocity = {
          x: velocity.x * friction,
          y: velocity.y * friction
        };
        
        dotPos.update(pos => ({
          x: Math.min(100, pos.x + velocity.x),
          y: Math.min(100, pos.y + velocity.y)
        }));        
        animationFrame = requestAnimationFrame(animate);
      }
    }
		animationFrame = requestAnimationFrame(animate);
	}

	onDestroy(() => {
		if (animationFrame)
			cancelAnimationFrame(animationFrame);
  });

	dotPos.subscribe((pos) => {

		// console.log(pos);

		pos = {
			// x: pos.x / 1000,
			x: 
			roundTo(
				Math.max(0, lerp(.01, 0, pos.x / 100)),
			),
			// y: pos.y / 1000
			y: 
			roundTo(
				Math.max(0, lerp(.01, 0, pos.y / 100))
			),
		}
		updateNodeData(id, { baseFrequency: `${pos.x} ${pos.y}` });
	});

	const spaceSeparated = (str: string, pos: number = 0) => {
		// console.log(str);
		str = (str || '').trim();
		const arr = str.split(' ');
		return Number(arr[pos] || str);
	}

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
			value={data.type}
			options={['turbulence', 'fractalNoise']}
		/>

		<input
			type="text"
			placeholder="baseFrequency"
			value={data.baseFrequency}
			step="0.01"
			on:input={(evt) => updateNodeData(id, { baseFrequency: evt.currentTarget.value })}
		/>
		<input
			type="number"
			placeholder="numOctaves"
			value={data.numOctaves || ''}
			on:input={(evt) => updateNodeData(id, { numOctaves: evt.currentTarget.value })}
		/>
		<input
			type="number"
			placeholder="seed"
			value={data.seed || ''}
			on:input={(evt) => updateNodeData(id, { seed: evt.currentTarget.value })}
		/>

		<div
			tabindex="-1"
			role="button"
			class="dragArea nodrag"

			bind:this={dragArea}
			on:mousedown|preventDefault={handleMouseDown}
			on:touchstart|preventDefault={handleMouseDown}
			style:--_x={cssPerc(spaceSeparated(data.baseFrequency))}
			style:--_y={cssPerc(spaceSeparated(data.baseFrequency,1))}
			>
			<!-- style:--_x={cssPerc($dotPos.x / size.width * 100)} -->
			<!-- style:--_y={cssPerc($dotPos.y / size.height * 100)} -->
			<!-- <div 
				class="dot"
			></div> -->
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

		--_clr-grid: var(--clr-text-t100);

		background-image: 
			linear-gradient(90deg, var(--_clr-grid) 1px, transparent 1px),
			linear-gradient(0deg, var(--_clr-grid) 1px, transparent 1px);

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
