<script lang="ts">
	import { Handle, Position, useSvelteFlow, type NodeProps } from '@xyflow/svelte';
	type $$Props = NodeProps;
	export let id: $$Props['id'];
	export let data: $$Props['data'];

	const { floodColor } = data;

  $: console.log(floodColor);

	const { updateNodeData } = useSvelteFlow();

  const convertAnyToHex = (anyColor: string) => {
    if (anyColor.startsWith('#')) return anyColor;
    // rgb(255, 0, 0) -> #ff0000
    const rgb2hex = c => '#'+c.match(/\d+/g).map(x=>(+x).toString(16).padStart(2,0)).join``
    return rgb2hex(anyColor); 
  };


</script>

<div class="node">
	<div class="content">
		<h3>Flood</h3>
		<input
			type="color"
			on:input={(evt) => updateNodeData(id, { floodColor: evt.currentTarget.value })}
			value={convertAnyToHex(floodColor as string)}
		/>
	</div>
	<Handle type="source" position={Position.Bottom} />
</div>
