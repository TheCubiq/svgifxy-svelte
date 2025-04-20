<script lang="ts">
	import { roundTo } from '$lib/utils/commonUtils';
    import Pan1DArea from '../nodes/controllers/Pan1DArea.svelte';
    import { createEventDispatcher } from 'svelte';
    
    export let value = 0.5;
    export let angle = 0;
    export let config = {
        min: 0,
        max: 1
    };
    
    const dispatch = createEventDispatcher();

    function handleChange(e: CustomEvent) {
        // Scale the 0-1 value from Pan1DArea to our min-max range
        const scaledValue = config.min + (e.detail.value * (config.max - config.min));
        value = scaledValue;
        dispatch('input', scaledValue);
    }

    // Convert our actual value back to 0-1 range for Pan1DArea
    $: normalizedValue = (value - config.min) / (config.max - config.min);
</script>

<Pan1DArea 
    value={normalizedValue}
    {angle} 
    mode="relative" 
    scrollMultiplier={0.2} 
    on:change={handleChange}
    let:pos
>
    <div class="pan1d-area" style:--_v="{roundTo(normalizedValue * 100)}%">
        <p>Value:</p>
        <p>{value.toFixed(2)}</p>
    </div>
</Pan1DArea>

<style>
    .controller-wrapper {
        width: 10rem;
        box-shadow: 6px 7px 16px 10px #0000000f;
        backdrop-filter: var(--ftr-glass); 
        border-radius: 0.3em;
    }

    .pan1d-area {
        border-radius: 0.5em;
        box-shadow: 6px 7px 16px 10px #0000000f;
        padding: 0.5em;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 0.5em;

        background: linear-gradient(90deg, var(--clr-text-t100) var(--_v, 0%), transparent 0px);
        border: solid 2px var(--clr-text-t100);
    }
</style>
