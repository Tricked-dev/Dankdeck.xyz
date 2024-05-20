<script lang="ts">
  import { createLinkPreview, melt } from '@melt-ui/svelte';
  import { fly } from 'svelte/transition';

  const {
    elements: { trigger, content, arrow },
    states: { open },
  } = createLinkPreview({
    forceVisible: true,
    openDelay: 200
  });

  export let parentClass = '';
  export let tooltipClass = '';
  export let showArrow = true;
</script>

<div class={parentClass} use:melt={$trigger}>
  <slot name="text"  />
</div>

{#if $open}
  <div
    use:melt={$content}
    transition:fly={{ y: -5, duration: 100 }}
    class={tooltipClass}
  >
    <slot name="tooltip" />
    {#if showArrow}
      <div use:melt={$arrow} />
    {/if}
  </div>
{/if}