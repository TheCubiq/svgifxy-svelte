<script lang="ts">
	import {
		SvelteFlow,
		Background,
		Controls,
		type NodeTypes,
		Position,
		useSvelteFlow,
		SvelteFlowProvider
	} from '@xyflow/svelte';
	import { writable } from 'svelte/store';
	import { xml2js, type ElementCompact } from 'xml-js';

	import type { Node } from '@xyflow/svelte';
	import { transformFilter } from '../utils/nodeUtils';
	import { getRandomPosition } from '$lib/utils/commonUtils';
	import Sidebar from './Sidebar.svelte';
	import { dndType } from '$lib/stores';
	// import { xyFilterNodes as nodeTypes } from './_nodes';
	import { createPortal } from '$lib/utils/portal';
	import DynamicNode from './nodes/DynamicNode.svelte';
	import PreviewNode from './nodes/PreviewNode.svelte';
	import SourceGraphicNode from './nodes/SourceGraphicNode.svelte';
	
	// Simple nodeTypes with just Dynamic and Preview nodes
	const nodeTypes = {
		preview: PreviewNode,
		sourceGraphic: SourceGraphicNode,
		dynamic: DynamicNode,
	};

	const { screenToFlowPosition } = useSvelteFlow();

	const demoFilter = `
    <filter id="grayscale-filter-0" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <title>Grayscale</title>
      <feFlood result="flood-0" flood-color="#3a000e"></feFlood>
      <feFlood result="flood-1" flood-color="rgb(0, 3, 255)"></feFlood>
      <feFlood result="flood-2" flood-color="#ff88ff"></feFlood>
      <feBlend result="blend-0" in="flood-0" in2="flood-1" mode="screen"></feBlend>
      <feBlend result="blend-1" in="flood-0" in2="flood-1" mode="normal"></feBlend>
    </filter>
    `;
	const objFilterRaw = xml2js(demoFilter, { compact: true });
  

	// const additionalNodes = [
	// 	{ id: 'preview', type: 'preview', position: getRandomPosition() },
	// 	{ id: 'preview2', type: 'preview', position: getRandomPosition() },
	// 	{ id: 'blur', type: 'feGaussianBlur', position: getRandomPosition() },
	// 	{ id: 'noiss', type: 'feTurbulence', position: getRandomPosition() },
	// 	{ id: 'displ', type: 'feDisplacementMap', position: getRandomPosition() },
	// 	{ id: 'sourc', type: 'sourceGraphic', position: getRandomPosition() },
	// 	{ id: 'conv', type: 'feConvolveMatrix', position: getRandomPosition() }
	// ];

  const nodes = writable(
    [
			// ...transformFilter(objFilterRaw as FilterInput),
			// ...additionalNodes
    ]
  );
  

	const initialEdges = [
		{
			source: 'blend-0',
			target: 'preview',
			id: 'e1'
		},
		{
			source: 'flood-1',
			target: 'blend-0',
			targetHandle: 'in2',
			id: 'e2'
		},
		{
			source: 'flood-0',
			target: 'blend-0',
			targetHandle: 'in',
			id: 'e3'
		}
	];
	const edges = writable(initialEdges);	

	const onDragOver = (event: DragEvent) => {
		event.preventDefault();

		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	};

	const handleModalAction = (e: CustomEvent) => {
		console.log(e);
		// if (e.detail.action === 'close') {
		// 	nodes.update((n) => n.filter((node) => node.id !== e.detail.id));
		// }
	};

	const handleAddNode = (e: DragEvent) => {
		const type = $dndType;
		if (!type) return;
		e.preventDefault();
		let position = { x: 0, y: 0 };
		if (e.dataTransfer) {
			position = screenToFlowPosition({
				x: e.clientX,
				y: e.clientY
			});
		} else {
			position = getRandomPosition();
		}
		const id = `node-${Math.random().toString(36).substring(2, 11)}`;
		
		// All nodes except preview are dynamic
		// gotta love the ai slop 🤷‍♂️
		// const nodeType = type === 'preview' ? 'preview' : 'dynamic';

		// check if nodeType is in nodeTypes
		const nodeType = type in nodeTypes ? type : 'dynamic';

		nodes.update((n) => [...n, ({
			id,
			type: nodeType,
			data: { type }, // Pass the filter type to DynamicNode
			position
		} as Node)]);
		
		dndType.set(null);
	};
</script>

<div class="editor">
	<!-- fitView -->
		<SvelteFlow
			{nodes}
			{edges}
			{nodeTypes}
			proOptions={{ hideAttribution: true }}
			maxZoom={5}
			on:drop={handleAddNode}
			on:dragover={onDragOver}
		>
			<Background bgColor="transparent"/>
		</SvelteFlow>

		<Sidebar {nodeTypes} on:addNode={handleAddNode} />
		
		<div use:createPortal={'right-sidebar'} class="portal">
			<!-- Portal Placeholder -->
		</div>
		<div use:createPortal={'floating-preview'} class="portal">
			<!-- Floating Preview Portal Placeholder -->
		</div>
</div>

<style>
	.editor {
		width: 100%;
		height: 100%;
		font-size: 16px;
	}
</style>
