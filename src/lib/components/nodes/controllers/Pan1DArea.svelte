<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Pan2DArea from './Pan2DArea.svelte';
    import { roundTo } from '$lib/utils/commonUtils';

    export let value = 0.5; // normalized (0-1)
    export let angle = 0; // angle in degrees (0 = horizontal, 90 = vertical)
    export let mode: 'absolute' | 'relative' = 'absolute';
    export let handleSize = 20;
    export let disabled = false;
    export let smoothScroll = true;
    export let friction = 0.9;
    export let infiniteMouse = false;
    export let sensitivitySettings = {
        default: 1,
        speed: [0.05, 5]
    };
    export let clamping = {
        min: true,
        max: true
    };

    export let scrollMultiplier = 1; // default scroll multiplier

    export let defaultValue = 0.5;

    const dispatch = createEventDispatcher();

    // Convert angle to radians for Math functions
    $: angleRad = (angle * Math.PI) / 180;

    // Calculate x and y components using trigonometry
    $: coords = {
        x: 0.5 + Math.cos(angleRad) * (value - 0.5),
        y: 0.5 + Math.sin(angleRad) * (value - 0.5)
    };

    // custom cursors based on angle uwu
    $: cursorStyle = `${infiniteMouse ? 'pointer' : 
        angle === 0 ? 'ew-resize' :
        angle === 90 ? 'ns-resize' :
        `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" style="transform: rotate(${angle}deg)"><text y="16" x="16" text-anchor="middle" dominant-baseline="middle" fill="white">↔</text></svg>') 16 16, auto`}`;

    function handleChange(event: CustomEvent) {
        const { x: newX, y: newY } = event.detail;
        
        // Project the 2D position onto our angle line
        // Calculate the displacement from center (0.5, 0.5)
        const dx = newX - 0.5;
        const dy = newY - 0.5;
        
        // Project the point onto our angle vector using dot product
        const projectedValue = (dx * Math.cos(angleRad) + dy * Math.sin(angleRad)) + 0.5;
        
        // Clamp the value between 0 and 1 and round to 3 decimal places
        value = roundTo(Math.max(0, Math.min(1, projectedValue)), 3);
        
        dispatch('change', { value });
    }

    function handleRelease(event: CustomEvent) {
        dispatch('release', { value });
    }

    function handleReset(event: CustomEvent) {
        value = defaultValue;
        dispatch('reset', { value, sensitivity: event.detail.sensitivity });
    }

    function handleSensitivity(event: CustomEvent) {
        dispatch('sensitivity', event.detail);
    }
</script>

<Pan2DArea
    x={coords.x}
    y={coords.y}
    {mode}
    {handleSize}
    {disabled}
    {smoothScroll}
    {friction}
    cursor={cursorStyle}
    {infiniteMouse}
    {sensitivitySettings}
    defaultX={0.5 + Math.cos(angleRad) * (defaultValue - 0.5)}
    defaultY={0.5 + Math.sin(angleRad) * (defaultValue - 0.5)}

    scrollToModify={{
        x: scrollMultiplier * Math.cos(angleRad),
        y: scrollMultiplier * Math.sin(angleRad)
    }}

    on:change={handleChange}
    on:release={handleRelease}
    on:reset={handleReset}
    on:sensitivity={handleSensitivity}
>
    <slot slot="default" pos={value} />
</Pan2DArea>

<style>
    /* Add any additional styles needed for the 1D component */
</style>