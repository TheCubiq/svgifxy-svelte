<script lang="ts">
	import FilterEditor from '$lib/components/FilterEditor.svelte';
	import { SvelteFlowProvider } from '@xyflow/svelte';
</script>

<main>
  <SvelteFlowProvider>
  <FilterEditor />
  </SvelteFlowProvider>
</main>

<style>
  main {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>