<script lang="ts">
	import {
		Handle,
		Position,
		useHandleConnections,
		useNodesData,
		type NodeProps
	} from '@xyflow/svelte';

  type $$Props = NodeProps;
 
  export let id: $$Props['id'];

	const connections = useHandleConnections({
		nodeId: id,
		type: 'target'
	});
 
  $: nodesData = useNodesData($connections.map(
    (connection) => {
      console.log(connection);
      return connection.source
    }
  ));

  $: console.log($nodesData);
</script>

<div class="node">
	<Handle type="target" position={Position.Left} />
	<div class="label">Incoming colors:</div>

	{#if $nodesData.length === 0}
		<div>no connected nodes</div>
	{:else}
		{#each $nodesData as nodeData}
    {@const color = nodeData.data.floodColor}
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
