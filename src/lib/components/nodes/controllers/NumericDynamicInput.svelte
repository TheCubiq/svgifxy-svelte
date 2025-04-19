<script lang="ts">
	import { Handle, Position, useSvelteFlow } from "@xyflow/svelte";

	const { updateNodeData } = useSvelteFlow();
  export let value: number;

  export let prop: string;

  export let valUpdate: (v: Object) => void;

</script>


<div class="inputWrapper">
  <!-- <Handle type="target" id={`num-${prop}`} position={Position.Left} /> -->
  <input 
  type="text" 
  class="nodrag"
  bind:value
  on:input={e => valUpdate({[prop]: Number(e.currentTarget.value)})}
  />
  </div>

<style>
  .inputWrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    position: relative;
  }

</style>