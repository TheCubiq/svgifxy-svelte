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

  .inputWrapper input {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    padding: 0.3em 0.5em;
    border: 1px solid var(--clr-text-t100);
    border-radius: var(--corner-rad);
    background: transparent;
    color: var(--clr-text);
    transition: border-color 0.2s;
  }

  .inputWrapper input:focus {
    border-color: var(--clr-primary-t400);
    outline: none;
    box-shadow: 0 0 0 2px var(--clr-primary-t100);
  }
</style>