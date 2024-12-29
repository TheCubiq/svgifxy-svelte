<script lang="ts">
	import { Handle, Position, useSvelteFlow, type NodeProps } from '@xyflow/svelte';
	import { anyToHex, rgb2hex } from '$lib/utils/commonUtils';
	type $$Props = NodeProps;
	export let id: $$Props['id'];
	export let data: $$Props['data'];

	// const { floodColor } = data;

	const floodColor = data["flood-color"];

  // $: console.log(floodColor);

	const { updateNodeData } = useSvelteFlow();

</script>

<div class="node">
	<div class="content">
		<h3>Flood</h3>
		<input
			type="color"
			on:input={
				(evt) => updateNodeData(
					id, { "flood-color": evt.currentTarget.value }
				)
			}
			value={anyToHex(floodColor as string)}
		/>
	</div>
	<Handle type="source" position={Position.Bottom} />
</div>
