<script lang="ts">
  import { SvelteFlow, Background, Controls } from '@xyflow/svelte';
  import { writable } from 'svelte/store';
  import GaussianBlurNode from './nodes/GaussianBlurNode.svelte';
  import FloodNode from './nodes/FloodNode.svelte';
  import SourceGraphicNode from './nodes/SourceGraphicNode.svelte';
  import PreviewNode from './nodes/PreviewNode.svelte';

  const initialNodes = [
    // {
    //   id: 'source',
    //   type: 'sourceGraphic',
    //   position: { x: 250, y: 50 },
    //   data: {}
    // },
    // {
    //   id: 'blur',
    //   type: 'gaussianBlur',
    //   position: { x: 250, y: 150 },
    //   data: { stdDeviation: 5 }
    // },
    {
      id: 'flood',
      type: 'flood',
      data: { color: '#ff4000' },
      position: { x: 250, y: 250 },
    },
    {
      id: 'flood2',
      type: 'flood',
      data: { color: '#40ff00' },
      position: { x: 150, y: 250 },
    },
    {
      id: 'preview',
      type: 'preview',
      position: { x: 250, y: 350 },
      data: { filter: '' }
    }
  ];

  const initialEdges = [
    // { id: 'e1', source: 'source', target: 'blur' },
    // { id: 'e2', source: 'blur', target: 'flood' },
    { id: 'e3', source: 'flood', target: 'preview' }
  ];

  const nodes = writable(initialNodes);
  const edges = writable(initialEdges);

  const nodeTypes = {
    // sourceGraphic: SourceGraphicNode,
    // gaussianBlur: GaussianBlurNode,
    flood: FloodNode,
    preview: PreviewNode
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
    <Background bgColor="var(--clr-bg)"/>
  </SvelteFlow>
</div>

<style>
  .editor {
    width: 100%;
    height: 100%;
    font-size: 16px;
  }
</style>