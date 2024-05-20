<script lang="ts">
  import { createAccordion, melt } from "@melt-ui/svelte";
  import { slide } from "svelte/transition";
  import { ChevronDown, ChevronUp } from "@/components/icons";

  const {
    elements: { content, item, trigger, root },
    helpers: { isSelected },
  } = createAccordion({
    multiple: true,
  });

  export let id = "expandable";
  export let icon: any;
  export let title: string;
  export let description = "Empty!";
  export let iconClass = "flex w-7 h-7 stroke-current ml-2";
</script>

<div class="mx-auto max-w-full w-full bg-base-200 first:rounded-t-lg last:rounded-b-lg border border-b-0 last:border-b border-neutral overflow-hidden" {...$root}>
  <div
    use:melt={$item(id)}
    class="overflow-hidden transition-colors"
  >
    <h2 class="flex">
      <button
        use:melt={$trigger(id)}
        class={[
          "flex flex-1 cursor-pointer items-center justify-between",
          " px-2 py-5 text-base font-medium leading-none",
          "text-base-content transition-colors  focus:!ring-0",
          "focus-visible:text-white",
        ].join(" ")}
      >
        <i class={iconClass}>
          <svelte:component this={icon}></svelte:component>
        </i>
        <span class="mr-auto ml-2 font-semibold">
          {title}
        </span>
        <span class="mr-2">
          {#if $isSelected(id)}
            <ChevronUp />
          {:else}
            <ChevronDown />
          {/if}
        </span>
      </button>
    </h2>
    {#if $isSelected(id)}
      <div
        class={[
          "content",
          "overflow-hidden text-sm bg-base-200 text-base-content",
          "border-t border-neutral"
        ].join(" ")}
        use:melt={$content(id)}
        transition:slide={{
          duration: 150,
        }}
      >
        <div class="p-4 text-base">
          <slot>
            {description}
          </slot>
        </div>
      </div>
    {/if}
  </div>
</div>
