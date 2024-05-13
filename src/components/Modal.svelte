<script lang="ts">
  import type { Snippet } from "svelte";
  import {} from "svelte-french-toast";
  interface Props {
    modal?: HTMLDialogElement;
    children: Snippet;
    title: string;
    boxClasses?: string;
    onClose?: () => unknown | Promise<unknown>;
    backdrop?: Snippet;
    width?: string;
  }
  let {
    modal = $bindable<HTMLDialogElement>(),
    children,
    title,
    boxClasses = "",
    onClose,
    backdrop,
    width = "max-w-[80rem]", // cant do [80rem] i think
  }: Props = $props();
</script>

<dialog class="modal" bind:this={modal} onclose={onClose}>
  <div class="modal-box {width} {boxClasses}">
    <form class="flex items-center justify-between" method="dialog">
      <h3 class="font-bold text-lg">{title}</h3>
      <button
        class="btn btn-sm btn-circle btn-ghost border-dashed border-5 border-gray-500 border"
      >
        ✕
      </button>
    </form>

    {@render children()}
  </div>

  <button class="modal-backdrop" onclick={() => modal?.close()}></button>
  {#if backdrop}
    {@render backdrop()}
  {/if}
</dialog>
