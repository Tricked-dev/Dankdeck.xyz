<script lang="ts">
  import type { Snippet } from 'svelte';
  interface Props {
    modal?: HTMLDialogElement;
    children: Snippet;
    title: string;
  }
  let { modal = $bindable<HTMLDialogElement>(), children, title }: Props = $props();
</script>

<dialog class="modal" bind:this={modal}>
  <div class="modal-box">
    <form class="flex items-center justify-between" method="dialog" >
      <h3 class="font-bold text-lg">{title}</h3>
      <button class="btn btn-sm btn-circle btn-ghost">
        ✕
      </button>
    </form>

    {@render children()}
  </div>

  <button class="modal-backdrop" onclick={() => modal?.close()}></button>
</dialog>
