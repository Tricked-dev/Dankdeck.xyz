<script lang="ts">
  import {
    createCombobox,
    melt,
    type ComboboxOptionProps,
  } from "@melt-ui/svelte";
  import { Check, ChevronDown, ChevronUp } from "@/components/icons";
  import { fly } from "svelte/transition";

  type Option = {
    name: string;
    // title: string;
    disabled: boolean;
    [key: string]: unknown;
  };

  export let options: Option[];

  const toOption = (option: Option): ComboboxOptionProps<Option> => ({
    value: option,
    label: option.name,
    disabled: option.disabled,
  });

  const {
    elements: { menu, input, option, label },
    states: { open, inputValue, touchedInput, selected },
    helpers: { isSelected },
  } = createCombobox<Option, true>({
    forceVisible: true,
    multiple: true,
  });

  $: if (!$open) {
    $inputValue = $selected?.map((opts) => opts.value.name).join(", ") || "";
  }

  $: filteredMangas = $touchedInput
    ? options.filter(({ name, ...test }) => {
        const normalizedInput = $inputValue?.toLowerCase();
        return name?.toLowerCase()?.includes(normalizedInput);
      })
    : options;

  export const selectedItems = selected;

  export let labelContent: string;
  export let placeholder: string;
</script>

<div class="flex flex-col gap-1">
  <!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
  <label use:melt={$label}>
    <span class="text-sm font-medium bg-base">{labelContent}</span>
  </label>

  <div class="relative">
    <input
      use:melt={$input}
      class="flex h-10 items-center justify-between rounded-lg bg-base-300
          px-3 pr-12 text-base-content input input-bordered w-full max-w-full"
      {placeholder}
    />
    <div class="absolute right-6 top-1/2 z-10 -translate-y-1/2 text-blue-900">
      {#if $open}
        <ChevronUp class="size-4" />
      {:else}
        <ChevronDown class="size-4" />
      {/if}
    </div>
  </div>
</div>
{#if $open}
  <ul
    class=" z-10 flex max-h-[300px] flex-col overflow-hidden rounded-lg"
    use:melt={$menu}
    transition:fly={{ duration: 150, y: -5 }}
  >
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <div
      class="flex max-h-full flex-col gap-0 overflow-y-auto bg-base-200 px-2 py-2 text-base-content"
      tabindex="0"
    >
      {#each filteredMangas as manga, index (index)}
        <li
          use:melt={$option(toOption(manga))}
          class="relative cursor-pointer scroll-my-2 rounded-md py-2 pl-4 pr-4
        hover:bg-base-100
        data-[highlighted]:bg-magnum-200 data-[highlighted]:text-base-content
          data-[disabled]:opacity-50"
        >
          {#if $selected?.find((x) => x.value.name === manga.name)}
            <div class="check absolute left-2 top-1/2 z-10">
              <Check class="size-4" />
            </div>
          {/if}
          <div class="pl-4">
            <span class="font-medium">{manga.title}</span>
            <span class="block text-sm opacity-75">{manga.name}</span>
          </div>
        </li>
      {:else}
        <li class="relative cursor-pointer rounded-md py-1 pl-8 pr-4">
          No results found
        </li>
      {/each}
    </div>
  </ul>
{/if}

<style lang="postcss">
  .check {
    @apply absolute left-2 top-1/2 text-base-content;
    translate: 0 calc(-50% + 1px);
  }
</style>
