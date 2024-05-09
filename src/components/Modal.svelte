<script lang="ts">
  import type { Snippet } from "svelte";
  import { Toaster } from "svelte-french-toast";
  interface Props {
    modal?: HTMLDialogElement;
    children: Snippet;
    title: string;
    boxClasses?: string;
  }
  let {
    modal = $bindable<HTMLDialogElement>(),
    children,
    title,
    boxClasses = "",
  }: Props = $props();
</script>

<dialog class="modal" bind:this={modal}>
  <div class="modal-box max-w-[80rem] {boxClasses}">
    <form class="flex items-center justify-between" method="dialog">
      <h3 class="font-bold text-lg">{title}</h3>
      <button class="btn btn-sm btn-circle btn-ghost"> ✕ </button>
    </form>

    {@render children()}
  </div>

  <button class="modal-backdrop" onclick={() => modal?.close()}></button>
</dialog>
