<script lang="ts">
	import { Handle, Position, useSvelteFlow, type NodeProps } from '@xyflow/svelte';
	type $$Props = NodeProps;
	export let id: $$Props['id'];
	export let data: $$Props['data'];

	const { color } = data;

	const { updateNodeData } = useSvelteFlow();
</script>

<div class="node">
  <div class="input">
      <Handle class="handle" type="target" id="in" />
      <Handle class="handle" type="target" id="in2" />
      <!-- <Handle class="handle" type="target" id="in3" /> -->
  </div>
	<div class="content">
		<h3>Blend</h3>
		<input
			type="color"
			on:input={(evt) => updateNodeData(id, { color: evt.currentTarget.value })}
			value={color}
		/>
	</div>
	<Handle type="source" position={Position.Bottom} />
</div>

<style>
  .input {
    display: flex;
    justify-content: space-around;
    position: absolute;
    inset: 0;
    bottom: unset;
  }

  :global(.input .svelte-flow__handle-top) {
    position: relative;
    top: 0;
    left: 0;
    transform: translate(0%, -50%);
  }

</style>
