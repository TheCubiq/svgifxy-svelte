<script lang="ts">
	import { getSource, limitedConnect } from "$lib/utils/nodeUtils";
	import { Handle, Position, useHandleConnections, useSvelteFlow, type NodeProps } from "@xyflow/svelte";
	import Select from "../Select.svelte";

  type $$Props = NodeProps;
	export let id: $$Props['id'];
	export let data: $$Props['data'];

  const { updateNodeData } = useSvelteFlow();

  const { scale } = data;

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

  const channels = [
    'R', 'G', 'B', 'A'
  ]

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
		<h3>Displacement</h3>
    <input 
      type="number" 
      placeholder="stdDeviation" 
      value={scale}
      on:input={(evt) => updateNodeData(id, { scale: evt.currentTarget.value })}
    />
    <!-- xchannelselector -->
    <Select
      value={data.xChannelSelector}
      options={channels}
      onChange={(evt) => updateNodeData(id, { xChannelSelector: evt.currentTarget.value })}
    />
    <!-- ychannelselector -->
    <Select
      value={data.yChannelSelector}
      options={channels}
      onChange={(evt) => updateNodeData(id, { yChannelSelector: evt.currentTarget.value })}
    />
  </div>
  <Handle type="source" position={Position.Bottom} />
  
</div>

<style>

</style>