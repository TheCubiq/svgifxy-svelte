<script lang="ts">
  import { Handle, Position} from '@xyflow/svelte';
  import { ImageIcon } from 'lucide-svelte';
</script>

<div class="node">
  <div class="content">
    <div class="title-row">
      <ImageIcon size="0.9em" strokeWidth={2} />
      <h3>Source Graphic</h3>
    </div>
    <div class="handles-labeled">
      <div class="handle-label">
        <span>Graphic</span>
        <Handle type="source" id="SourceGraphic" position={Position.Right} />
      </div>
      <div class="handle-label">
        <span>Alpha</span>
        <Handle type="source" id="SourceAlpha" position={Position.Right} />
      </div>
    </div>
  </div>
</div>

<style>
  .title-row {
    display: flex;
    align-items: center;
    gap: 0.35em;
    color: var(--clr-accent);
  }

  .title-row h3 {
    color: var(--clr-text-t900);
  }

  .handles-labeled {
    display: flex;
    flex-direction: column;
    gap: 0.3em;
    padding-top: 0.25em;
  }

  .handle-label {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.4em;
    font-size: 0.65rem;
    color: var(--clr-text-t400);
    font-family: var(--font-mono);
  }
</style>