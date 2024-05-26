<script lang="ts">
  import { createTooltip, melt } from '@melt-ui/svelte';
  import { fade } from 'svelte/transition';

  const {
    elements: { trigger, content, arrow },
    states: { open },
  } = createTooltip({
    positioning: {
      placement: 'top',
    },
    openDelay: 350,
    closeDelay: 0,
    closeOnPointerDown: false,
    forceVisible: true,
  });

</script>

<button type="button" class="trigger bg-base-100" use:melt={$trigger} aria-label="Add">
  <slot name="text" />
</button>

{#if $open}
  <div
    use:melt={$content}
    transition:fade={{ duration: 100 }}
    class="z-10 rounded-lg bg-neutral shadow"
  >
    <div use:melt={$arrow} />
    <slot name="tooltip">
      NONE
    </slot>
  </div>
{/if}

<style lang="postcss">
    .trigger {
        @apply inline-flex h-12 w-12 items-center justify-center rounded-full;
        @apply focus-visible:ring focus-visible:ring-offset-2;
        @apply p-0 text-sm font-medium overflow-hidden;
    }
</style>