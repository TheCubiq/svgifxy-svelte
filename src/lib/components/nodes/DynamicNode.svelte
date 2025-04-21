<script lang="ts">
    import { Handle, Position, useSvelteFlow, useHandleConnections, type NodeProps, type Node, useNodeConnections } from '@xyflow/svelte';
    import { anyToHex, rgb2hex } from '$lib/utils/commonUtils';
    import RightSidebar from '../RightSidebar.svelte';
    import CodeMirror from "svelte-codemirror-editor";
    import { javascript } from "@codemirror/lang-javascript";
    import { oneDark } from '@codemirror/theme-one-dark';
    import { CodeIcon, HardDriveDownloadIcon } from 'lucide-svelte';

    import initialEffect from './internalNodes/gaussianBlur.js?raw';
    import nodeInternals from '$lib/utils/nodeInternals.js?raw';
    import { onMount } from 'svelte';
	import SelectInput from './controllers/SelectInput.svelte';
    import ControllerDefines from './controllers/ControllerDefines.svelte';
    import { nodeRegistry } from './nodeRegistry';

    type DynamicNode = Node<{
        scriptable: string;
        svgFilter: string;
        customProps: Record<string, any>;
    }>
    type $$Props = NodeProps<DynamicNode>;
    export let id: $$Props['id'];
    export let data: $$Props['data'];
    // Add autocompile prop defaulting to true
    export let autocompile = true;
    
    const { updateNodeData } = useSvelteFlow();

    let showSettings = false;
    let nodeSetup: any;
    let nodeInputs: any;
    let nodeInputHandles: string[] = [];
    let nodeLogic = (s: any, id: any, inputs: any) => '';
    
    const connections = useNodeConnections({ handleType: 'target'});
    let inputConnections: any[] = [] // todo: find type later
    

    const getConnectionObject = () => {
        return Object.entries(inputConnections).reduce((acc: any, [key, value]: any, i) => {
            acc[nodeInputHandles[i]] = value.source;
            return acc;
        }, {});        
    }

    const updateDynamicNode = (props: any) => updateNodeData(id, { 
        customProps: props,
        svgFilter: nodeLogic(props, id, getConnectionObject()),	
    });

    const handleCompile = () => {
        const wrapped = `
            ${nodeInternals}
            ${data.scriptable}
            return {nodeSetup, nodeLogic};
        `;
        try {
            const compiled = new Function(wrapped)();
            nodeSetup = compiled.nodeSetup;
            nodeLogic = compiled.nodeLogic;
            nodeInputs = nodeSetup.props;
            nodeInputHandles = nodeSetup.inputs ?? [];

            const props = nodeSetup.props.reduce((acc: any, i: any) => { 
                acc[i.name] = i.name in data.customProps ? data.customProps[i.name] : i.default;
                return acc;
            }, {});

            updateDynamicNode(props);
        } catch (err) {
            console.error('Failed to compile node:', err);
        }
    };

    const handleInput = (e: SvelteInputEvent, i: { name: string | number; }) => {
        let localProps = data.customProps;
        console.log(localProps);
        localProps[i.name] = e.currentTarget.value;
        updateDynamicNode(localProps);
    };
    
    connections.subscribe((c) => {
        inputConnections = c
        if (c.length > 0) updateDynamicNode(data.customProps)
    })
        
    onMount(async () => {
        // Check if we have a preset from the type
        const preset = data.type && nodeRegistry[data.type];
        await updateNodeData(id, { 
            scriptable: preset || initialEffect,
            customProps: {},
            svgFilter: ''
        });
        // await tick(); // Wait for data update
        if (preset && autocompile) {
            handleCompile();
        }
    });
</script>

<RightSidebar 
    bind:show={showSettings} 
    title={`Edit ${nodeSetup?.displayName || 'Node'}`}
>
    <div>
        <h3>Node Script</h3>
        <p>Edit the code to modify node behavior</p>
    </div>

    <CodeMirror bind:value={data['scriptable']} lang={javascript()} theme={oneDark} />
    
    <svelte:fragment slot="overlay">
        <button class="clickable" on:click={handleCompile}>
            <HardDriveDownloadIcon size="1.2em" />
        </button>
    </svelte:fragment>
</RightSidebar>

<div class="node">
    <div class="content">
        <div class="handle-wrapper">
            {#each nodeInputHandles as handle}
                <Handle 
                    type="target" 
                    position={Position.Top} 
                    id={handle}
                />
            {/each}
        </div>
        
        <div class="title-wrapper">
            <h3>{nodeSetup?.displayName || "Dynamic Node"}</h3>
            <button class="settings" on:click={() => showSettings = true}><CodeIcon size="1em"/></button>
        </div>
        {#if nodeSetup}
            {#each nodeInputs as i}
                <ControllerDefines 
                    type={i.type}
                    value={data.customProps[i.name]}
                    config={i.controllerConfig}
                    onChange={(value) => {
                        let localProps = data.customProps;
                        localProps[i.name] = value;
                        updateDynamicNode(localProps);
                    }}
                />
            {/each}
        {:else}
            <p>Node Not Loaded Yet</p>
        {/if}
        
        </div>
    <div class="handle-wrapper">
        <Handle type="source" position={Position.Bottom} />
    </div>

</div>
    
<style>
.node {
    min-width: 5rem;
}

.title-wrapper {
    display: flex;
    justify-content: space-between;
}

.settings {
    aspect-ratio: 1;
    border-radius: 99em;
    display: flex;
    align-self: center;
    padding: 0.4em;
    color: var(--clr-text);
    border: none;
    cursor: pointer;
    background-color: transparent;
    border: solid 1px var(--clr-text-t100);
    backdrop-filter: blur(1px);
}

button.clickable {
    cursor: pointer;
    background-color: var(--clr-text-t100);
    color: var(--clr-text);
    border: none;
    padding: 0.75em;
    border-radius: var(--corner-rad);
    pointer-events: auto;
    display: flex;
}

.handle-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-around;
}
</style>