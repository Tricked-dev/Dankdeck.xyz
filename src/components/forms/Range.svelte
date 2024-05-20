<script lang="ts">
  import { createSlider, melt } from "@melt-ui/svelte";

  export let max: number = 100;

  const {
    elements: { root, range, thumbs },
    states: { value: v },
  } = createSlider({
    defaultValue: [3, max],
    max: max,
    autoSort: true,
  });

  export const value = v;
</script>

<span use:melt={$root} class="relative flex h-[20px] w-full items-center">
  <span class="h-[3px] w-full bg-neutral">
    <span use:melt={$range} class="h-[3px] bg-neutral-content" />
  </span>

  {#each $thumbs as thumb}
    <span
      use:melt={thumb}
      class="h-5 w-5 rounded-full bg-neutral-content focus:ring-4 focus:!ring-black/40"
    />
  {/each}
</span>
