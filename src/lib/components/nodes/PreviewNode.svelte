<script lang="ts">
	import {
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
	import Select from '../controls/Select.svelte';

	type $$Props = NodeProps;

	export let id: $$Props['id'];

	const c_in1 = useHandleConnections({
		nodeId: id,
		type: 'target'
	});

	const allConnections = useEdges();

	$: nodesData = useNodesData(findAllConnections(id, $allConnections));

	let renderMode = 'css';

	function handleRenderModeChange(e) {
		renderMode = e.detail;
	}
</script>

<div class="node">
	<Handle type="target" position={Position.Left} isConnectable={limitedConnect($c_in1)} />
	<div class="label">SVG Filter:</div>

	<div class="controls">
		 <Select
            value={renderMode}
            config={{
                options: [
                    { name: 'CSS Filter', value: 'css' },
                    { name: 'SVG Filter', value: 'svg' }
                ]
            }}
            on:input={handleRenderModeChange}
        />
	</div>

	{#if $nodesData.length === 0}
		<div>Nothing to preview</div>
	{:else}
		<div class="wrap">
			<SvgPreview {id} nodeData={$nodesData} resizable bg cssCompile={renderMode === 'css'} />
		</div>
	{/if}
</div>

<style>
	.wrap {
		padding: 0.5em;
		min-width: 5rem;
	}

	.controls {
		padding: 0.5em;
		border-bottom: 1px solid var(--clr-text-t200);
	}
</style>
