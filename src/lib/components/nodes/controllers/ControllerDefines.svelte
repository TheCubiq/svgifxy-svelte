<script lang="ts">
    import Slider from '../../controls/Slider.svelte';
    import Knob from '../../controls/Knob.svelte';
    import Select from '../../controls/Select.svelte';
    import Pan2DControl from '../../controls/Pan2DControl.svelte';
    import FileInput from './FileInput.svelte';

    export let type: string;
    export let value: any;
    export let config: any = {};
    export let onChange: (value: any) => void;

    const controllers: Record<string, any> = {
        'slider': Slider,
        'knob': Knob,
        'select': Select,
        'pan2d': Pan2DControl,
        'file': FileInput,
        // Add more controllers here as needed
    };

    $: controller = controllers[type];

    // Helper to ensure numeric values
    function handleInput(event: CustomEvent) {
        // const numericValue = Number(event.detail);
        onChange(event.detail);
    }
</script>

{#if controller}
    <svelte:component 
        this={controller} 
        value={value} 
        {config} 
        on:input={handleInput}
    />
{:else}
    <input 
        {type} 
        {value} 
        on:input={(e) => onChange(e.currentTarget.value)} 
    />
{/if}
