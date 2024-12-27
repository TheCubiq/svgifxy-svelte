<script>
	let { children } = $props();
	import './styles.css';
	import '@xyflow/svelte/dist/style.css';
</script>

{@render children()}
