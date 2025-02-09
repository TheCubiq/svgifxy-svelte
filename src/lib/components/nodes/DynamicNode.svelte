<script lang="ts">
	import { Handle, Position, useSvelteFlow, type NodeProps, type Node } from '@xyflow/svelte';
	import { anyToHex, rgb2hex } from '$lib/utils/commonUtils';
	import Modal from '../Modal.svelte';
	import CodeMirror from "svelte-codemirror-editor";
	import { javascript } from "@codemirror/lang-javascript";
	import { oneDark } from '@codemirror/theme-one-dark';
	import { CodeIcon } from 'lucide-svelte';

	import feflood from './internalNodes/feflood.js?raw';
	import { onMount } from 'svelte';

	type DynamicNode = Node<{
		scriptable: string;
		svgFilter: string;
		customProps: any;
	}>
	type $$Props = NodeProps<DynamicNode>;
	export let id: $$Props['id'];
	export let data: $$Props['data'];

	let showSettings = false;

	let nodeInputs: any;
	let nodeLogic = (s: any) => '';

	const handleCompile = () => {
		const wrapped = `${data.scriptable}; return {nodeInputs, nodeLogic};`;
		const compiled = new Function(wrapped)();
		nodeInputs = compiled.nodeInputs;
		nodeLogic = compiled.nodeLogic;
		// todo: fix this
		const props = nodeInputs.reduce((acc: any, i: any) => {
			acc[i.name] = i.default;
			return acc;
		}, {});

		updateNodeData(id, { customProps: props, "scriptable": data.scriptable });
	};

	const { updateNodeData,  } = useSvelteFlow();

	const handleInput = (e: SvelteInputEvent, i: { name: string | number; }) => {
		let {customProps: props} = data;
		props[i.name] = e.currentTarget.value;

		updateNodeData(id, { 
			"svgFilter": nodeLogic(props), 
			customProps: props 
		});
	};
		
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
		{#each nodeInputs as i}
			{#if i.type === 'select'}
				<select>
					{#each i.options as o}
						<option value={o}>{o}</option>
					{/each}
				</select>
			{:else}
				<input type={i.type} value={data.customProps[i.name]} on:input={e => handleInput(e, i)} />
			{/if}
		{/each}
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