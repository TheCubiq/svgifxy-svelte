<script lang="ts">
	import { Handle, Position, useSvelteFlow, type NodeProps } from '@xyflow/svelte';
	import { anyToHex, rgb2hex } from '$lib/utils/commonUtils';
	import { limitedConnect } from '$lib/utils/nodeUtils';
	type $$Props = NodeProps;
	export let id: $$Props['id'];
	export let data: $$Props['data'];

	const { updateNodeData } = useSvelteFlow();

	// $: {
	// 	console.log(data);
	// }

  const getControllerAttributes = (data:any[]) => {

    console.log(data);

    // const filterType = data.filterType || 'unknown';

    // const newData = Object.entries(data).map(([key, value]) => {
    //   return { key, value };
    // });

    // todo: remove hidden keys
    const hiddenKeys = ['filterType', 'in', 'in2', 'result', '_nested'];
    const newData = Object.entries(data).filter(([key, value]) => !hiddenKeys.includes(key)).map(([key, value]) => {
      return { key, value };
    });

    // console.log(newData)
    return newData;
  }

</script>

<div class="node">
	<div class="content">
		<h3>{data.filterType}</h3>

		<div class="handle-wrapper">
			<Handle class="handle" type="target" id="in" position={Position.Top} />
			<!-- isConnectable={limitedConnect($c_in1)} -->
			<!-- isConnectable={limitedConnect($c_in2)} -->
			<Handle class="handle" type="target" id="in2" position={Position.Top} />
		</div>

		<ul>
			{#each getControllerAttributes(data) as attr}
				<li>
					<div class="handle-wrapper">
						<Handle
							class="handle"
							type="target"
							id={'h' + attr.key}
							isConnectable={true}
							position={Position.Left}
						/>
					</div>
					<label for={attr.key}>{attr.key}:</label>

					<input
						type="text"
						value={attr.value}
						id={attr.key}
						on:input={(evt) => updateNodeData(id, { [attr.key]: evt.currentTarget.value })}
					/>

				</li>
			{/each}
		</ul>
	</div>
	<Handle type="source" position={Position.Bottom} />
</div>

<style>
	ul {
		list-style: none;
		display: flex;
		gap: 0.6em;
		flex-direction: column;
	}

	li {
		background-color: var(--clr-bg-t600);
		display: flex;
		gap: 0.3em;
		flex-direction: column;
		padding: 0.5em;
		border-radius: 0.3em;
		position: relative;
	}
</style>
