<script lang="ts">
    import Pan1DArea from '../nodes/controllers/Pan1DArea.svelte';
    export let value = 0.5;
    export let angle = 0;
</script>

    <Pan1DArea {value} {angle} mode="relative" 
    scrollMultiplier={0.2} let:pos>
        <div class="pan1d-area" style:--_v="{pos * 100}%">
            <p>Value:</p>
            <p>{pos}</p>
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
