<script lang="ts">
	import { Handle, Position, useHandleConnections, useNodeConnections, useSvelteFlow, type NodeProps } from '@xyflow/svelte';
	import { anyToHex, rgb2hex } from '$lib/utils/commonUtils';
	import DynamicMatrix from './controllers/DynamicMatrix.svelte';
	import { limitedConnect } from '$lib/utils/nodeUtils';
	type $$Props = NodeProps;
	export let id: $$Props['id'];
	export let data: $$Props['data'];

	// const { floodColor } = data;

	const floodColor = data["flood-color"];

  // $: console.log(floodColor);

	const { updateNodeData } = useSvelteFlow();


	const c_in1 = useNodeConnections({
      id,
      handleId: "in",
      handleType: 'target'
  })

</script>

<div class="node">
	<Handle 
    class="handle" 
    type="target" 
    id="in" 
    isConnectable={limitedConnect($c_in1)}
    position={Position.Top} />
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
