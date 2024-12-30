<script lang="ts">
  import { SvelteFlow, Background, Controls, type NodeTypes } from '@xyflow/svelte';
  import { writable } from 'svelte/store';
  import GaussianBlurNode from './nodes/GaussianBlurNode.svelte';
  import FloodNode from './nodes/FloodNode.svelte';
  import SourceGraphicNode from './nodes/SourceGraphicNode.svelte';
  import PreviewNode from './nodes/PreviewNode.svelte';
  import TurbulenceNode from './nodes/TurbulenceNode.svelte';
  import { xml2js, type ElementCompact } from 'xml-js';

  import type { Node } from '@xyflow/svelte';
	import BlendNode from './nodes/BlendNode.svelte';
	import { transformFilter } from '../utils/nodeUtils';


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
  

  const additionalNodes = [
    { id: 'preview', type: 'preview', position: { x: 0, y: 0 }},
    { id: 'preview2', type: 'preview', position: { x: 0, y: 0 }},
    { id: 'blur', type: 'feGaussianBlur', position: { x: 0, y: 0 }},
    { id: 'noiss', type: 'feTurbulence', position: { x: 0, y: 0 }},
  ];

  const nodes = writable(
    [
      ...transformFilter(objFilterRaw as FilterInput), 
      ...additionalNodes
    ]
  );
  
  
  const initialEdges = [
    {
        "source": "blend-0",
        "target": "preview",
        "id": "e1",
    },
    {
        "source": "flood-1",
        "target": "blend-0",
        "targetHandle": "in2",
        "id": "e2",
    },
    {
        "source": "flood-0",
        "target": "blend-0",
        "targetHandle": "in",
        "id": "e3"
    }
  ];
  const edges = writable(initialEdges);

  const nodeTypes: NodeTypes = {
    feFlood: FloodNode,
    feBlend: BlendNode,
    feGaussianBlur: GaussianBlurNode,
    feTurbulence: TurbulenceNode,
    preview: PreviewNode
  };

  // $: edges.subscribe((value) => {
  //   console.log("edgeupdate", {value});
  // });

</script>

<div class="editor">
  <SvelteFlow
  {nodes}
  {edges}
    {nodeTypes}
    fitView
    proOptions={{ hideAttribution: true }}
    maxZoom={5}
  >
    <Background bgColor="transparent"/>
  </SvelteFlow>
</div>

<style>
  .editor {
    width: 100%;
    height: 100%;
    font-size: 16px;
  }
</style>