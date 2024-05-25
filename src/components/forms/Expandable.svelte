<script lang="ts">
  import { createAccordion, melt } from "@melt-ui/svelte";
  import { slide } from "svelte/transition";
  import { ChevronDown, ChevronUp } from "@/components/icons";

  export let id = "expandable";
  export let opened = false;
  const {
    elements: { content, item, trigger, root },
    helpers: { isSelected },
  } = createAccordion({
    multiple: true,
    defaultValue: [ opened ? id : '' ],
  });

  export let icon: any;
  export let title: string;
  export let description = "Empty!";
  export let iconClass = "flex w-7 h-7 stroke-current ml-2";
  export let clazz = "mx-auto max-w-full w-full bg-base-200 first:rounded-t-lg last:rounded-b-lg border border-b-0 last:border-b border-neutral overflow-hidden";
  export let buttonClass = "flex flex-1 cursor-pointer items-center justify-between px-2 py-5 text-base text-lg leading-none text-base-content transition-colors focus:!ring-0 focus-visible:text-white"
  export let contentClass = "content overflow-hidden text-sm bg-base-200 text-base-content border-t border-neutral"
  export let chevronSize = '1em'
  export let titleClass = 'mr-auto ml-2 font-semibold'
</script>

<div class="{clazz}" {...$root}>
  <div
    use:melt={$item(id)}
    class="overflow-hidden transition-colors"
  >
    <h2 class="flex">
      <button
        use:melt={$trigger(id)}
        class="{buttonClass}"
      >
        {#if icon}
          <i class={iconClass}>
            <svelte:component this={icon}></svelte:component>
          </i>
        {/if}
        <span class={titleClass}>
          {title}
        </span>
        <span class="mr-2">
          {#if $isSelected(id)}
            <ChevronUp width={chevronSize} height={chevronSize} />
          {:else}
            <ChevronDown width={chevronSize} height={chevronSize} />
          {/if}
        </span>
      </button>
    </h2>
    {#if $isSelected(id)}
      <div
        class="{contentClass}"
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
