<script lang="ts">
	import type { ChangeEventHandler, EventHandler, FormEventHandler } from "svelte/elements";
	import NumbericDynamicInput from "./NumericDynamicInput.svelte";

  // controller for feConvolveMatrix

  export let matrix: string = "0 0 0 0 1 0 0 0 0" 
  export let updateNodeData: (id: string, data: any) => void;
  export let id: string;

  const handleOnInput = (evt: SvelteInputEvent, i: number | string) => {
     evt.preventDefault();
    //  convert to number
    i = Number(i);
     if (evt.currentTarget.value) {
      evt.currentTarget.value = matrixArray[i].toString();
      return;
    }
    matrixArray[i] = Number(evt.currentTarget.value);
  }

  const updateMatrix = (prop: Partial<OffsetNode['data']>) => {
    const [key, val] = Object.entries(prop)[0];
    matrixArray[Number(key)] = val;
  }

  const handleDynamicStep = (value, caretPos, keyUp) => {
    // Handle the sign
    let sign = 1;
    let signOffset = 0;
    const isNegative = value.startsWith('-');
    if (isNegative) {
      sign = -1;
      signOffset = 1;
    }
      
    const numberString = isNegative ? value.slice(1) : value;
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

    // handling 1 that would become 0
    // special case for 1x, 1xx, etc.
    const editingDigit = numberString[caretPosInNumber];
    if (
      // at the very left
      caretPosInNumber == 0 
      && editingDigit === '1' 
      && numberString.length > 1
      // up negative, down positive
      && (keyUp == isNegative) 
    ) {
      // console.info("special")
      exponent -= 1;
    }

    const delta = Math.pow(10, exponent);

    // Parse current value to a number
    let currentValue = parseFloat(value) || 0.0;

    // Calculate the new value
    let newValue = currentValue + (keyUp ? delta : -delta);

    // Handle precision to avoid floating point issues
    // todo: fix the precision cutting off the numbers
    const precision = Math.max(0, -exponent);
    const newValueString = newValue.toFixed(precision);
  
  
    // ---------------
  
    // Adjust caret position if necessary
    // todo: fix the caret pos here:
    // let newCaretPos = caretPos + newValueString.length - value.length;
    
    let newCaretPos = caretPos;
  
    // this code is crappy but fixes some issues with the caret.
  
    const [oldIntegerPart, oldDecimalPart] = numberString.split('.');
    const [newIntegerPart, newDecimalPart] = newValueString.split('.');

    // Check if a new digit was added at the front
    if (newIntegerPart.length > oldIntegerPart.length && caretPos <= oldIntegerPart.length) {
        newCaretPos += newIntegerPart.length - oldIntegerPart.length;
    } else if (caretPos > decimalPos) {
        const oldLength = oldDecimalPart.length;
        const newLength = newDecimalPart.length;
        const diff = newLength - oldLength;
        if (diff > 0) {
            if (caretPos === value.length) {
                // If cursor is at the end, move it one position to the left
                newCaretPos = value.length;
            } else {
                newCaretPos += diff;
            }
        }
    }
  
    // ---------------

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
      <!-- <input
        type="text" 
        value={value}
        defaultValue={null}
        on:keydown={(e) => handleKeyDown(e, i)}
        on:input={(e) => handleOnInput(e, i)}
      /> -->
      <NumbericDynamicInput
        value={value}
        prop={i + ''}
        valUpdate={updateMatrix}
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