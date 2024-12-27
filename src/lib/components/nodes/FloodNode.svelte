<script lang="ts">
  import type { Writable } from 'svelte/store';
  import { Handle, Position, useSvelteFlow, type NodeProps } from '@xyflow/svelte';
  type $$Props = NodeProps;
  export let id: $$Props['id'];
  export let data: $$Props['data'];
 
  const { color } = data;

  const { updateNodeData } = useSvelteFlow();

</script>

<div class="node">
  <div class="content">
    <h3>Flood</h3>
    <input
      type="color"
      on:input={(evt) => updateNodeData(id, { color: evt.currentTarget.value })}
      value={color}
      />
  </div>
  <Handle type="source" position={Position.Bottom} />
</div>