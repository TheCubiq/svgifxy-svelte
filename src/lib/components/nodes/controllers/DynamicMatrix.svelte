<script lang="ts">
  // controller for feConvolveMatrix

  export let matrix: string = "0 0 0 0 1 0 0 0 0" 
  export let updateNodeData: (id: string, data: any) => void;
  export let id: string;

  
  $: matrixArray = (matrix).split(" ").map((v) => Number(v));
  
  let matrixDimensions = [3, 3];

  const getCssGrid = (dimensions: number[]) => {
    return `grid-template-columns: repeat(${dimensions[0]}, 1fr);`
  }

  
  $: updateNodeData(id, { kernelMatrix: matrixArray.join(" ") });

</script>

<div>
  <div class="matrix"
    style={getCssGrid(matrixDimensions)}
  >
    {#each matrixArray as value, i}
      <input 
        type="number" 
        value={value}
        defaultValue={null}
        on:input={(evt) => {
          matrixArray[i] = Number(evt.currentTarget.value);
        }}
      />
    {/each}
  </div>
</div>

<style>
  input {
    width: 4em;
  }

  .matrix {
    display: grid;
    gap: .3em;
  }
</style>