<script lang="ts">
  export let options: any[] = [];
  export let value: any;
  export let onChange: (value: any) => void;
</script>

<select bind:value on:change={onChange}>
  {#each options as option}
    <option value={option}>{option}</option>
  {/each}
</select>
