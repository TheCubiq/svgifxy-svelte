<script lang="ts">
	import { Handle, Position, useEdges, useHandleConnections, useNodesData, useSvelteFlow, type NodeProps } from '@xyflow/svelte';
	import Select from './controllers/Select.svelte';
	import { findAllConnections, getSource, limitedConnect } from '$lib/utils/nodeUtils';
	import SvgPreview from './controllers/SvgPreview.svelte';
	import { spring, tweened } from 'svelte/motion';
	import { getMousePos, lerp, mod, roundTo, type GestureEvent } from '$lib/utils/commonUtils';
	import { Mouse } from 'lucide-svelte';
	import { cubicOut } from 'svelte/easing';
	import { onDestroy, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	type $$Props = NodeProps;
	export let id: $$Props['id'];
	export let data: $$Props['data'];


	let isDragging = false;

	let startPos = { x: 0, y: 0 };

	
	const { updateNodeData } = useSvelteFlow();
	
	interface DOMRectDimensions {
		x: number;
		y: number;
		width: number;
		height: number;
	}
	
	let size: DOMRectDimensions = { x: 0, y: 0, width: 0, height: 0};
	
	
	let dragArea: HTMLDivElement;
	
	const dotPos = writable({ x: 0, y: 0 });
	let velocity = { x: 0, y: 0 };
	let lastCoords = { x: 0, y: 0 };
	let animationFrame: number = 0;
	
	const handleDrag = (evt: GestureEvent) => {
		if (!isDragging) return;
		evt.preventDefault();
		let { x, y } = getMousePos(evt);

		x = (x - startPos.x) / size.width * 100
		y = (y - startPos.y) / size.height * 100

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
			x: data.dx,
			y: data.dy
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
		roundTo(val)
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
          x: pos.x + velocity.x,
          y: pos.y + velocity.y
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
		pos = {
			x: roundTo(pos.x, 1),
			y: roundTo(pos.y, 1),
		}
		updateNodeData(id, { dx: pos.x, dy: pos.y });
	});

	const spaceSeparated = (str: string, pos: number = 0) => {
		str = (str || '').trim();
		const arr = str.split(' ');
		return Number(arr[pos] || str);
	}

	
	const offset_in = useHandleConnections({
      nodeId: id,
      id: "in",
      type: 'target'
  })

	$: {
    updateNodeData(id, { in: getSource($offset_in)});
  }

	// const {baseFrequency, numOctaves, seed, type} = data;

	// $: nodesData = useNodesData(id);

	const allConnections = useEdges();
	$: nodesData = useNodesData(findAllConnections(id, $allConnections, true));

</script>


<svelte:window 
	on:mouseup|preventDefault={handleMouseUp}
	on:mousemove|preventDefault={handleDrag}
	on:touchend|preventDefault={handleMouseUp}
	on:touchmove|preventDefault={handleDrag}
/>

<div class="node">
	<Handle 
      class="handle" 
      type="target" 
      id="in" 
      isConnectable={limitedConnect($offset_in)}
      position={Position.Top} />
	<div class="content">
		<h3>Offset</h3>
		
		<input 
			type="number" 
			value={data.dx} 
			class="nodrag"
			on:input={(e) => updateNodeData(id, { dx: e.currentTarget.value })}
		/>

		<input 
			type="number" 
			value={data.dy} 
			class="nodrag"
			on:input={(e) => updateNodeData(id, { dy: e.currentTarget.value })}
		/>

		<div
			tabindex="-1"
			role="button"
			class="dragArea nodrag"

			bind:this={dragArea}
			on:mousedown|preventDefault={handleMouseDown}
			on:touchstart|preventDefault={handleMouseDown}
			style:--_x={cssPerc(data.dx)}
			style:--_y={cssPerc(data.dy)}
			>
			<!-- style:--_x={cssPerc($dotPos.x / size.width * 100)} -->
			<!-- style:--_y={cssPerc($dotPos.y / size.height * 100)} -->
			<!-- <div 
				class="dot"
			></div> -->
			<SvgPreview {id} nodeData={$nodesData} bg />
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
		
		position: relative;

		&::after {
			content: '';
			position: absolute;
			inset: 0;
			
			background-image: 
				linear-gradient(90deg, var(--_clr-grid) 1px, transparent 1px),
				linear-gradient(0deg, var(--_clr-grid) 1px, transparent 1px);
			background-size: 20px 20px;
			background-position: var(--_x, 0) var(--_y, 0);
		}
	}
</style>
