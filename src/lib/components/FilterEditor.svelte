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
	import DisplacementNode from './nodes/DisplacementNode.svelte';
	import DynamicNode from './nodes/DynamicNode.svelte';

  import demoFilter from './nodes/demoFilter.svg?raw';
  

  const objFilterRaw = xml2js(demoFilter, { compact: true });
  

  const nodes = writable(
    [
      ...transformFilter(objFilterRaw), 
      // ...additionalNodes
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
    dynamicType: DynamicNode
    // feFlood: FloodNode,
    // feBlend: BlendNode,
    // feGaussianBlur: GaussianBlurNode,
    // feDisplacementMap: DisplacementNode,
    // feTurbulence: TurbulenceNode,
    // preview: PreviewNode,
    // sourceGraphic: SourceGraphicNode,
  };

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