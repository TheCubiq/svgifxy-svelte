<script lang="ts">
  // controller for feConvolveMatrix

  export let matrix: string = "0 0 0 0 1 0 0 0 0" 
  export let updateNodeData: (id: string, data: any) => void;
  export let id: string;

  const handleOnInput = (evt, i: number) => {
     evt.preventDefault();
     if (isNaN(evt.currentTarget.value)) {
      evt.currentTarget.value = matrixArray[i];
      return;
    }
    matrixArray[i] = Number(evt.currentTarget.value);
  }

  const handleDynamicStep = (e, i) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;

    e.preventDefault();

    
    const direction = e.key === 'ArrowUp' ? 'up' : 'down';
    const input = e.target;
    const value = input.value;
    let caretPos = input.selectionStart;
    
    // Handle the sign
    let sign = 1;
    let signOffset = 0;
    if (value[0] === '-') {
      sign = -1;
      signOffset = 1;
    }

    debugger;
      
    const numberString = value.startsWith('-') ? value.slice(1) : value;
    let caretPosInNumber = caretPos - signOffset;
    caretPosInNumber = Math.max(0, caretPosInNumber);

    let decimalPos = numberString.indexOf('.');
    if (decimalPos === -1) {
        decimalPos = numberString.length;
    }

    // Calculate exponent based on caret position
    let exponent;
    if (caretPosInNumber <= decimalPos) {
        exponent = decimalPos - caretPosInNumber - 1;
    } else {
        exponent = decimalPos - caretPosInNumber;
    }

    const delta = Math.pow(10, exponent);

    // Parse current value to a number
    let currentValue = parseFloat(value) || 0.0;

    // Calculate the new value
    let newValue = currentValue + (direction === 'up' ? delta : -delta);

    // Handle precision to avoid floating point issues
    const precision = Math.max(0, -exponent);
    newValue = parseFloat(newValue.toFixed(precision));

    // Update the input value
    input.value = newValue.toString();

    // Adjust caret position if necessary
    const newCaretPos = Math.max(0, caretPos + input.value.length - value.length);
    input.setSelectionRange(newCaretPos, newCaretPos);
    
    handleOnInput(e, i);

  }

  
  $: matrixArray = (matrix).split(" ").map((v) => Number(v));
  
  let matrixDimensions = [3, 3];

  const getCssGrid = (dimensions: number[]) => {
    return `grid-template-columns: repeat(${dimensions[0]}, 1fr);`
  }

  
  $: updateNodeData(id, { kernelMatrix: matrixArray.join(" ") });

</script>

<div>
  <div class="matrix nodrag"
    style={getCssGrid(matrixDimensions)}
  >
    {#each matrixArray as value, i}
      <input
        type="text" 
        value={value}
        defaultValue={null}
        on:keydown={(e) => handleDynamicStep(e, i)}
        on:input={(e) => handleOnInput(e, i)}
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