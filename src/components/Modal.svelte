<script lang="ts">
    	import type { Snippet } from 'svelte';
  interface Props {
    modal?: HTMLDialogElement;
    children: Snippet;
  }
  let { modal = $bindable<HTMLDialogElement>(), children }: Props = $props();
</script>

<dialog class="modal" bind:this={modal} id="sellModal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >✕</button
      >
    </form>

    {@render children()}
  </div>

  <button class="modal-backdrop" onclick={() => modal?.close()}></button>
</dialog>
