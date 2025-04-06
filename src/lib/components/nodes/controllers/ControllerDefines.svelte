<script lang="ts">
    import Slider from '../../controls/Slider.svelte';
    import Knob from '../../controls/Knob.svelte';

    export let type: string;
    export let value: any;
    export let config: any = {};
    export let onChange: (value: any) => void;

    const controllers: Record<string, any> = {
        'slider': Slider,
        'knob': Knob,
        // Add more controllers here as needed
    };

    $: controller = controllers[type];

    // Helper to ensure numeric values
    function handleSliderInput(event: CustomEvent) {
        const numericValue = Number(event.detail);
        onChange(numericValue);
    }
</script>

{#if controller}
    <svelte:component 
        this={controller} 
        value={Number(value)} 
        {config} 
        on:input={handleSliderInput}
    />
{:else}
    <input 
        {type} 
        {value} 
        on:input={(e) => onChange(e.currentTarget.value)} 
    />
{/if}
