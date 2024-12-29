<script lang="ts">
	import { Handle, Position, useSvelteFlow, type NodeProps } from "@xyflow/svelte";

  type $$Props = NodeProps;
	export let id: $$Props['id'];
	export let data: $$Props['data'];

  const { updateNodeData } = useSvelteFlow();

  const { stdDeviation } = data;

</script>

<div class="node">
  <!-- <Handle class="handle" type="source" position={Position.Top} /> -->
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