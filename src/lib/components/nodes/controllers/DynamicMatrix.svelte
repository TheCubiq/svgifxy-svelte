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

  const handleDynamicStep = (value, caretPos, keyUp) => {
    // Handle the sign
    let sign = 1;
    let signOffset = 0;
    if (value[0] === '-') {
      sign = -1;
      signOffset = 1;
    }

      
    const numberString = value.startsWith('-') ? value.slice(1) : value;
    let caretPosInNumber = caretPos - signOffset;
    caretPosInNumber = Math.max(0, caretPosInNumber);

    let decimalPos = numberString.indexOf('.');
    if (decimalPos === -1) {
        decimalPos = numberString.length;
    }

    // Calculate exponent based on caret position
    let exponent = decimalPos - caretPosInNumber;
    if (caretPosInNumber <= decimalPos) {
        exponent -= 1;
    }

    const editingDigit = numberString[caretPosInNumber];

    if (
      caretPosInNumber == 0 
      && editingDigit === '1' 
      && numberString.length > 1
      // up negative, down positive
      && (keyUp == value.startsWith('-')) 
    ) {
      // special case for 1x, 1xx, etc.
      exponent -= 1;
      console.log(editingDigit, exponent);
    }

    const delta = Math.pow(10, exponent);

    // Parse current value to a number
    let currentValue = parseFloat(value) || 0.0;

    // Calculate the new value
    let newValue = currentValue + (keyUp ? delta : -delta);

    // Handle precision to avoid floating point issues
    const precision = Math.max(0, -exponent);
    // const precision = 9;
    const newValueString = newValue.toFixed(precision);

    // Adjust caret position if necessary
    const newCaretPos = Math.max(0, caretPos + newValueString.length - value.length);

    return {value: newValueString, caret: newCaretPos}
  }

  const handleKeyDown = (e: any, i: number) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;

    e.preventDefault();
    const input = e.target;

    const dyn = handleDynamicStep(
      input.value, 
      input.selectionStart,
      e.key === 'ArrowUp'
    );

    console.log(dyn);

    input.value = dyn.value;
    input.setSelectionRange(dyn.caret, dyn.caret);
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
        on:keydown={(e) => handleKeyDown(e, i)}
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