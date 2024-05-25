<script lang="ts">
  import { Check, ChevronDown } from "@/components/icons";
  import { createSelect, melt, type SelectOption } from "@melt-ui/svelte";
  import { fade } from 'svelte/transition';
  import { isObject } from "@trpc/server/unstable-core-do-not-import";

  // const options = {
  //   sweet: ['Caramel', 'Chocolate', 'Strawberry', 'Cookies & Cream'],
  //   savory: ['Basil', 'Bacon', 'Rosemary'],
  // };

  export let defaultSelected: SelectOption | undefined;
  export let disabled: boolean = false

  const {
    elements: { trigger, menu, option, group, groupLabel: _groupLabel, label: _label },
    states: { selectedLabel, open },
    helpers: { isSelected },
  } = createSelect({
    forceVisible: true,
    positioning: {
      placement: 'bottom',
      fitViewport: true,
      sameWidth: true,
    },
    defaultSelected,
    disabled
  });

  export let options: Record<string, string[]> | [];

  $: computedOptions = isObject(options) ? options : {
    options
  };
  export const selected = selectedLabel;
  export let groupLabel = isObject(options)
  export let placeholder = 'Select an option'
  export let clazz = 'flex flex-col gap-1';
  export let selectClass = 'min-w-[120px]'
  export let roundedClass = 'rounded-lg'
  export let label: string | null  = null;
  export let labelClass = '';
</script>

<div class="{clazz}">
  <!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
  {#if label}
    <label class="block {labelClass}" use:melt={$_label}>{label}</label>
  {/if}
  <!--rounded-none is important to reset what input has-->
  <button
    class="{selectClass} rounded-none {roundedClass} input input-bordered flex items-center justify-between px-3 py-2 shadow transition-opacity hover:opacity-90"
    use:melt={$trigger}
  >
    {$selectedLabel || placeholder}
    <ChevronDown class="size-5" />
  </button>
  {#if $open}
    <div
      class="z-10 flex max-h-[300px] flex-col overflow-y-auto rounded-lg bg-base-200 p-1 shadow focus:!ring-0"
      use:melt={$menu}
      transition:fade={{ duration: 150 }}
    >
      {#each Object.entries(computedOptions) as [key, arr]}
        <div use:melt={$group(key)}>
          {#if groupLabel}
            <div
              class="py-1 pl-4 pr-4 font-semibold capitalize text-neutral-800"
              use:melt={$_groupLabel(key)}
            >
              {key}
            </div>
          {/if}
          {#each arr as item}
            <div
              class="relative cursor-pointer rounded-lg py-2 pl-8 pr-4 focus:z-10 focus:bg-base-100
                  data-[highlighted]:bg-base-100 data-[disabled]:opacity-50"
              use:melt={$option({ value: item, label: item })}
            >
              <div class="check {$isSelected(item) ? 'block' : 'hidden'}">
                <Check class="size-4" />
              </div>

              {item}
            </div>
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="postcss">
    .check {
        @apply absolute left-2 top-1/2 text-base-content;
        translate: 0 calc(-50% + 1px);
    }
</style>