<script lang="ts">
	import {
		convertToSvgFilter,
		createFilter,
		findAllConnections,
		limitedConnect
	} from '$lib/utils/nodeUtils';
	import { toKebabCase } from '$lib/utils/commonUtils';
	import {
		Handle,
		Position,
		useEdges,
		useHandleConnections,
		useNodesData,
		type NodeProps
	} from '@xyflow/svelte';
	import SvgPreview from './controllers/SvgPreview.svelte';

	type $$Props = NodeProps;

	export let id: $$Props['id'];

	const c_in1 = useHandleConnections({
		nodeId: id,
		type: 'target'
	});

	const allConnections = useEdges();

	$: nodesData = useNodesData(findAllConnections(id, $allConnections));
</script>

<div class="node">
	<Handle type="target" position={Position.Left} isConnectable={limitedConnect($c_in1)} />
	<div class="label">SVG Filter:</div>

	{#if $nodesData.length === 0}
		<div>Nothing to preview</div>
	{:else}
		<div class="wrap">
			<SvgPreview {id} nodeData={$nodesData} resizable bg />
		</div>
	{/if}
</div>

<style>
	.wrap {
		padding: 0.5em;
		min-width: 5rem;
	}
</style>
