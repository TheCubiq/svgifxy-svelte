<script lang="ts">
	import { Handle, Position, useSvelteFlow, type NodeProps } from '@xyflow/svelte';
	import { anyToHex, rgb2hex } from '$lib/utils/commonUtils';
	import Modal from '../Modal.svelte';
	import CodeMirror from "svelte-codemirror-editor";
	import { javascript } from "@codemirror/lang-javascript";
	import { oneDark } from '@codemirror/theme-one-dark';
	import { CodeIcon } from 'lucide-svelte';

	import feflood from './internalNodes/feflood.js?raw';
	import { onMount } from 'svelte';

	type $$Props = NodeProps;
	export let id: $$Props['id'];
	export let data: $$Props['data'];

	let showSettings = false;

	let nodeInputs: any, nodeLogic;

	const handleCompile = () => {
		const wrapped = `${data['scriptable']}; return {nodeInputs, nodeLogic};`;
		const compiled = new Function(wrapped)();
		nodeInputs = compiled.nodeInputs;
		nodeLogic = compiled.nodeLogic;

		console.log(nodeInputs, nodeLogic);
	};

	const { updateNodeData,  } = useSvelteFlow();

	onMount(() => {
		updateNodeData(id, { "scriptable": feflood });
	});

</script>

<!-- {#if showSettings} -->
	
	
<Modal bind:showModal={showSettings} customClass="nodrag nopan nozoom">
	<div>
		<h1>Modal</h1>
		<p>todo-stuff</p>
	</div>

	<CodeMirror bind:value={data['scriptable']} lang={javascript()} theme={oneDark}/>
	<button on:click={handleCompile}>compile</button>
</Modal>

<div class="node">
	<button class="settings" on:click={() => showSettings = true}><CodeIcon size="1em"/></button>
	<div class="content">
		<h3>Dyn</h3>
		<!-- <textarea spellcheck="false" class="nodrag" bind:value={data['scriptable']}></textarea> -->


		{#each nodeInputs as i}
			<input type="text" value={i.type} />
		{/each}

		<!-- <input
			type="color"
			on:input={
				(evt) => updateNodeData(
					id, { "flood-color": evt.currentTarget.value }
				)
			}
			value={anyToHex(floodColor as string)}
		/> -->
	</div>
	<Handle type="source" position={Position.Bottom} />
</div>


<style>

.node {
	min-width: 5rem;
}


.settings {
		float: inline-end;

		background-color: var(--clr-bg);
		aspect-ratio: 1;
		border-radius: 99em;
		display: flex;
		align-self: center;
		padding: 0.4em;
		color: var(--clr-text);
		border: none;

		cursor: pointer;
	}
</style>