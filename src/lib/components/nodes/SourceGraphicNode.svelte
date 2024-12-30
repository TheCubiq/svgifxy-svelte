<script lang="ts">
  import { Handle, Position} from '@xyflow/svelte';
</script>

<div class="node">
  <div class="content">
    <h3>Source Graphic</h3>
  </div>
  <div class="handle-wrapper">
    <Handle type="source" id="SourceGraphic" position={Position.Right} />
    <Handle type="source" id="SourceAlpha" position={Position.Right} />
  </div>
</div>