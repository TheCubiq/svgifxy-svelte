<script lang="ts">
	import { Handle, Position, useHandleConnections, useNodesData, useSvelteFlow, type Connection, type NodeProps } from '@xyflow/svelte';
	import { readable } from 'svelte/store';
	import Select from '../Select.svelte';
	import { limitedConnect, getSource } from '$lib/utils/nodeUtils';
	type $$Props = NodeProps;
	export let id: $$Props['id'];
	export let data: $$Props['data'];
  
	const { updateNodeData } = useSvelteFlow();
	const { mode } = data;

  const c_in1 = useHandleConnections({
      nodeId: id,
      id: "in",
      type: 'target'
  })

  const c_in2 = useHandleConnections({
      nodeId: id,
      id: "in2",
      type: 'target'
  })

  $: {
    console.log($c_in1)
    updateNodeData(id, { 
      in: getSource($c_in1), 
      in2: getSource($c_in2) 
    });
  }

  const blendModes = ['normal', 'multiply', 'screen', 'darken', 'lighten', 'overlay', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity']
</script>

<div class="node">
  <div class="handle-wrapper">
      <Handle 
        class="handle" 
        type="target" 
        id="in" 
        isConnectable={limitedConnect($c_in1)}
        position={Position.Top} />
      <Handle 
        class="handle" 
        type="target" 
        id="in2"  
        isConnectable={limitedConnect($c_in2)}
        position={Position.Top} />
  </div>
	<div class="content">
		<h3>Blend</h3>
    <Select
      onChange={(evt) => updateNodeData(id, { mode: evt.currentTarget.value })}
      value={mode}
      options={blendModes}
    />
	</div>
	<Handle type="source" position={Position.Bottom} />
</div>