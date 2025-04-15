<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let value: string = '';
    export let config: any = {};

    async function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string;
                dispatch('input', dataUrl);
            };
            reader.readAsDataURL(file);
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
    .preview {
        margin-top: 0.5em;
        max-width: 10rem;
        overflow: hidden;
    }
    .preview img {
        width: 100%;
        height: auto;
        object-fit: contain;
    }
</style>
