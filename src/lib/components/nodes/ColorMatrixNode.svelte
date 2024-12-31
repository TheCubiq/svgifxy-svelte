<script lang="ts">
	import { limitedConnect } from "$lib/utils/nodeUtils";
	import { Handle, Position, useHandleConnections, useSvelteFlow, type NodeProps } from "@xyflow/svelte";
	import Select from "../Select.svelte";
	import { onMount } from "svelte";

  type $$Props = NodeProps;
	export let id: $$Props['id'];
	export let data: $$Props['data'];

  const { updateNodeData } = useSvelteFlow();

  const { type, values } = data;

  const c_in1 = useHandleConnections({
      nodeId: id,
      id: "in",
      type: 'target'
  })

  const onTypeChange = (evt) => {

    const newType = evt.currentTarget.value

    console.log(newType)

    let values = "1"

    if (newType == "matrix") {
      values = "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"
    }
    
    updateNodeData(id, { 
      type: newType,
      values
    })
  }


</script>

<div class="node">
  <Handle 
    class="handle" 
    type="target" 
    id="in" 
    isConnectable={limitedConnect($c_in1)}
    position={Position.Top} />
  <div class="content">
		<h3>Color Matrix</h3>
    <Select
			onChange={onTypeChange}
			value={type}
			options={['matrix', 'saturate', 'hueRotate', 'luminanceToAlpha']}
		/>

    <input 
      type="text" 
      placeholder="values" 
      value={values}
      on:input={(evt) => updateNodeData(id, { values: evt.currentTarget.value })}
    />

  </div>
  <Handle type="source" position={Position.Bottom} />
  
</div>

<style>

</style>