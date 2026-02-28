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

	let renderMode = 'svg';

	function handleRenderModeChange(e) {
		renderMode = e.detail;
	}
</script>

<div class="node">
	<Handle type="target" position={Position.Left} isConnectable={limitedConnect($c_in1)} />
	<div class="label">Preview</div>

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
		<div class="empty-state">
			<span>Connect a node</span>
		</div>
	{:else}
		<div class="wrap">
			<SvgPreview {id} nodeData={$nodesData} resizable bg cssCompile={renderMode === 'css'} floatable={true} />
		</div>
	{/if}
</div>

<style>
	.wrap {
		padding: 0.4em;
		min-width: 6rem;
	}

	.label {
		font-family: var(--font-display);
		font-size: 0.85rem;
		font-weight: 600;
		padding: 0.3em 0.4em;
	}

	.controls {
		padding: 0.4em;
		border-bottom: 1px solid var(--clr-text-t100);
	}

	.empty-state {
		padding: 1.5em 1em;
		text-align: center;
		color: var(--clr-text-t300);
		font-size: 0.75rem;
		font-style: italic;
	}
</style>
