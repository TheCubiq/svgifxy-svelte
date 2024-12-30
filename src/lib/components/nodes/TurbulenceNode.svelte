<script lang="ts">
	import { Handle, Position, useSvelteFlow, type NodeProps } from '@xyflow/svelte';
	import Select from '../Select.svelte';
	type $$Props = NodeProps;
	export let id: $$Props['id'];
	export let data: $$Props['data'];

	const {baseFrequency, numOctaves, seed, type} = data;

	const { updateNodeData } = useSvelteFlow();

</script>

<div class="node">
	<div class="content">
		<h3>Turbulence</h3>


		<Select
			onChange={(evt) => updateNodeData(id, { type: evt.currentTarget.value })}
			value={type}
			options={['fractalNoise', 'turbulence']}
		/>

		<input
			type="number"
			placeholder="baseFrequency"
			value={baseFrequency}
			step="0.01"
			on:input={(evt) => updateNodeData(id, { baseFrequency: evt.currentTarget.value })}
		/>
		<input
			type="number"
			placeholder="numOctaves"
			value={numOctaves}
			on:input={(evt) => updateNodeData(id, { numOctaves: evt.currentTarget.value })}
		/>
		<input
			type="number"
			placeholder="seed"
			value={seed}
			on:input={(evt) => updateNodeData(id, { seed: evt.currentTarget.value })}
		/>
	</div>
	<Handle type="source" position={Position.Bottom} />
</div>
