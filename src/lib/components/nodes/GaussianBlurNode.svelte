<script lang="ts">
	import { limitedConnect } from "$lib/utils/nodeUtils";
	import { Handle, Position, useHandleConnections, useSvelteFlow, type NodeProps } from "@xyflow/svelte";

  type $$Props = NodeProps;
	export let id: $$Props['id'];
	export let data: $$Props['data'];

  const { updateNodeData } = useSvelteFlow();

  const { stdDeviation } = data;

  const c_in1 = useHandleConnections({
      nodeId: id,
      id: "in",
      type: 'target'
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
		<h3>GaussianBlur</h3>
    <input 
      type="number" 
      placeholder="stdDeviation" 
      value={stdDeviation}
      on:input={(evt) => updateNodeData(id, { stdDeviation: evt.currentTarget.value })}
    />
  </div>
  <Handle type="source" position={Position.Bottom} />
  
</div>

<style>

</style>