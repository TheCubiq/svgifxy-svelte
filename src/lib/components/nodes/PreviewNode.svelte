<script lang="ts">
	import { convertToSvgFilter, createFilter, findAllConnections } from '$lib/utils/nodeUtils';
	import { toKebabCase } from '$lib/utils/commonUtils';
	import {
		Handle,
		Position,
		useEdges,
		useNodesData,
		type NodeProps
	} from '@xyflow/svelte';

	type $$Props = NodeProps;

	export let id: $$Props['id'];

	const allConnections = useEdges();

	$: nodesData = useNodesData(findAllConnections(id, $allConnections));

	$: cssFilter = createFilter(id, convertToSvgFilter(id, $nodesData), true)
</script>

<div class="node">
	<Handle type="target" position={Position.Left} />
	<div class="label">Incoming colors:</div>

	{#if $nodesData.length === 0}
		<div>no connected nodes</div>
	{:else}
    <div
      class="color"
      style:--f={cssFilter}
    ></div>
	{/if}
</div>

<style>
	.color {
		border-radius: 0.3em;
		padding: 0.15em;
		outline: solid 1px var(--clr-text-t200);
		aspect-ratio: 1;
		background-image: url(https://media1.tenor.com/m/BCAxaLlW-soAAAAd/smile-cat.gif);
		background-size: cover;
    overflow: hidden;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      backdrop-filter: var(--f);
    }
	}
</style>
