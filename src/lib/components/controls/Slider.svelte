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
    .pan1d-area {
        border-radius: var(--corner-rad);
        box-shadow: inset 0 1px 4px rgb(0 0 0 / 20%);
        padding: 0.5em;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 0.5em;

        background: linear-gradient(90deg, var(--clr-primary-t200) var(--_v, 0%), transparent 0px);
        border: 1px solid var(--clr-text-t100);
        transition: border-color 0.2s;
        font-family: var(--font-mono);
        color: var(--clr-text-t600);
    }

    .pan1d-area:hover {
        border-color: var(--clr-primary-t300);
    }

    .pan1d-area p:first-child {
        font-size: 0.8em;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--clr-text-t300);
        font-family: var(--font-body);
    }
</style>
