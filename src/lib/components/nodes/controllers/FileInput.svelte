<script lang="ts">
    import { createEventDispatcher, onDestroy } from 'svelte';
    const dispatch = createEventDispatcher();

    export let value: string = '';
    export let config: any = {};

    let currentBlobUrl: string | null = null;

    onDestroy(() => {
        if (currentBlobUrl) {
            URL.revokeObjectURL(currentBlobUrl);
        }
    });

    const handleFileSelect = async(event: Event) => {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        
        if (file) {
            if (currentBlobUrl) {
                URL.revokeObjectURL(currentBlobUrl);
            }
            currentBlobUrl = URL.createObjectURL(file);
            dispatch('input', currentBlobUrl);
        }
    }
</script>

<div class="file-input">
    <input 
        type="file" 
        accept={config.accept || '*'}
        on:change={handleFileSelect}
    />
    {#if value}
        <div class="preview">
            <img src={value} alt="Preview" />
        </div>
    {/if}
</div>

<style>
    .file-input {
        width: 100%;
    }

    .file-input input[type="file"] {
        width: 100%;
        font-family: var(--font-body);
        font-size: 0.75rem;
        color: var(--clr-text-t500);
        padding: 0.5em;
        border: 1px dashed var(--clr-text-t200);
        border-radius: var(--corner-rad);
        background: var(--clr-text-t50);
        cursor: pointer;
        transition: all 0.2s;
    }

    .file-input input[type="file"]:hover {
        border-color: var(--clr-primary-t300);
        background: var(--clr-primary-t50);
    }

    .file-input input[type="file"]::file-selector-button {
        font-family: var(--font-body);
        font-size: 0.7rem;
        font-weight: 500;
        padding: 0.3em 0.6em;
        border: 1px solid var(--clr-text-t100);
        border-radius: 0.3rem;
        background: var(--clr-text-t100);
        color: var(--clr-text);
        cursor: pointer;
        margin-right: 0.5em;
        transition: all 0.15s;
    }

    .file-input input[type="file"]::file-selector-button:hover {
        background: var(--clr-primary-t200);
        color: var(--clr-primary);
        border-color: var(--clr-primary-t300);
    }

    .preview {
        margin-top: 0.5em;
        max-width: 8rem;
        overflow: hidden;
        border-radius: var(--corner-rad);
        border: 1px solid var(--clr-text-t100);
    }
    .preview img {
        width: 100%;
        height: auto;
        object-fit: contain;
        display: block;
    }
</style>
