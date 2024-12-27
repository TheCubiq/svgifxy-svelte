<!-- 
<div class="node">
  <Handle type="target" position={Position.Top} />
  <div class="content">
    <h3>Preview</h3>
    <div class="preview">
      <svg width="100" height="100">
        <defs>
          <filter id="preview-filter">
            {@html data.filter}
          </filter>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="red"
          filter="url(#preview-filter)"
        />
      </svg>
    </div>
  </div>
</div> -->

<script lang="ts">
	import {
		Handle,
		Position,
		useHandleConnections,
		useNodesData,
		type NodeProps
	} from '@xyflow/svelte';

	type $$Props = NodeProps;

  interface Props {
    id: $$Props['id'];
  }

  let { id }: Props = $props();

	const connections = useHandleConnections({
		nodeId: id,
		type: 'target'
	});

	let nodesData = $derived(useNodesData(
    $connections.map((connection) => connection.source)
  ));
</script>

<div class="node">
	<Handle type="target" position={Position.Left} />
	<div class="label">Incoming colors:</div>

	{#if $nodesData.length === 0}
		<div>no connected nodes</div>
	{:else}
		{#each $nodesData as nodeData}
    {@const color = nodeData.data.color}
			<div class="color" style="background: {color};">
        {color}
      </div>
		{/each}
	{/if}
</div>


<style>
  .color {
    border-radius: .3em;
    padding: .15em;
    outline: solid 1px var(--clr-text-t200);
  }
  /* .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
  .preview {
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
  } */
</style>
