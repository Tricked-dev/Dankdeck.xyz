<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    class?: string;
  }

  let { children, class: clazz = "max-w-[70rem]" }: Props = $props();
</script>

<div class="flex flex-wrap justify-center w-full {clazz} gap-2 mx-auto">
  {@render children()}
</div>
