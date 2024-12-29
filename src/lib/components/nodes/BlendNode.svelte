<script lang="ts">
	import { Handle, Position, useHandleConnections, useNodesData, useSvelteFlow, type Connection, type NodeProps } from '@xyflow/svelte';
	import { readable } from 'svelte/store';
	import Select from '../Select.svelte';
	type $$Props = NodeProps;
	export let id: $$Props['id'];
	export let data: $$Props['data'];
  
	const { updateNodeData } = useSvelteFlow();
	const { mode } = data;

  const canConnect = (connection: Connection[]) => {
    return connection.length === 0;
  }

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
    updateNodeData(id, { 
      in: $c_in1[0]?.source, 
      in2: $c_in2[0]?.source 
    });
  }

  const blendModes = ['normal', 'multiply', 'screen', 'darken', 'lighten', 'overlay', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity']
</script>

<div class="node">
  <div class="input">
      <Handle 
        class="handle" 
        type="target" 
        id="in" 
        isConnectable={canConnect($c_in1)}
        position={Position.Top} />
      <Handle 
        class="handle" 
        type="target" 
        id="in2"  
        isConnectable={canConnect($c_in2)}
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

<style>
  .input {
    display: flex;
    justify-content: space-around;
    position: absolute;
    inset: 0;
    bottom: unset;
  }

  :global(.input .svelte-flow__handle-top) {
    position: relative;
    top: 0;;
    left: 0;
    transform: translate(0%, -50%);
  }

</style>
