<script lang="ts">
	import { Handle, Position, useSvelteFlow, type NodeProps } from '@xyflow/svelte';
	import { anyToHex, rgb2hex } from '$lib/utils/commonUtils';
	import DynamicMatrix from './controllers/DynamicMatrix.svelte';
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
		<h3>Convolve</h3>
		<!-- <input 
      type="text" 
      placeholder="values" 
      value={data.kernelMatrix}
      on:input={(evt) => updateNodeData(id, { kernelMatrix: evt.currentTarget.value })}
    /> -->
    <DynamicMatrix
      matrix={data.kernelMatrix}
      updateNodeData={updateNodeData}
      id={id}
    />
	</div>
	<Handle type="source" position={Position.Bottom} />
</div>
